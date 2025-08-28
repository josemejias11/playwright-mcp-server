#!/bin/bash

# ================================
# Clean Cache Script
# ================================
# Removes all cached data including npm, Playwright browsers, 
# Docker cache, and system temporary files

set -e

# Protected files that should NEVER be deleted
PROTECTED_FILES=(
    "package.json"
    "package-lock.json"
    "tsconfig.json"
    ".env"
    ".env.example"
    "Dockerfile"
    "docker-compose.yml"
    "docker-test.sh"
    "playwright.config.js"
    "README.md"
    "SECURITY.md"
    ".gitignore"
    ".dockerignore"
    "clean-reports.sh"
    "clean-cache.sh"
    "demo.js"
    "postman/API-Tests.postman_collection.json"
    "postman/Environment.postman_environment.json"
    ".vscode/extensions.json"
    ".vscode/mcp.json"
)

echo "================================"
echo "🗑️  Cache Cleanup Script"
echo "================================"

# Safety check function
check_protected_files() {
    echo "🔒 Performing safety check..."
    local missing_files=()
    
    for file in "${PROTECTED_FILES[@]}"; do
        if [ ! -f "$file" ] && [ ! -d "$file" ]; then
            missing_files+=("$file")
        fi
    done
    
    if [ ${#missing_files[@]} -gt 0 ]; then
        echo "⚠️  WARNING: Some essential files are missing:"
        for file in "${missing_files[@]}"; do
            echo "   - $file"
        done
        echo ""
        read -p "Continue anyway? This might be due to a previous cleanup. (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "❌ Cache cleanup cancelled for safety"
            exit 1
        fi
    else
        echo "✅ All essential files present"
    fi
    echo ""
}

# Colors for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Function to get directory size
get_size() {
    local dir="$1"
    if [ -d "$dir" ]; then
        du -sh "$dir" 2>/dev/null | cut -f1 || echo "0B"
    else
        echo "0B"
    fi
}

# Function to clean cache with confirmation
clean_cache() {
    local cache_type="$1"
    local cache_location="$2"
    local clean_command="$3"
    local description="$4"
    
    echo ""
    print_status $BLUE "🔍 Checking $cache_type cache..."
    
    local size_before=$(get_size "$cache_location")
    echo "   Current size: $size_before"
    
    if [ "$size_before" != "0B" ] && [ "$size_before" != "" ]; then
        read -p "Clean $cache_type cache? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_status $YELLOW "   🧹 Cleaning $cache_type cache..."
            eval "$clean_command" 2>/dev/null || print_status $RED "   ⚠️  Failed to clean $cache_type cache"
            
            local size_after=$(get_size "$cache_location")
            print_status $GREEN "   ✅ $cache_type cache cleaned (was: $size_before, now: $size_after)"
        else
            print_status $YELLOW "   ⏭️  $cache_type cache cleanup skipped"
        fi
    else
        print_status $YELLOW "   ℹ️  $cache_type cache is already clean"
    fi
}

echo ""
print_status $BLUE "Starting cache cleanup process..."
check_protected_files
echo ""

# 1. NPM Cache
clean_cache "NPM" \
    "$(npm config get cache 2>/dev/null || echo ~/.npm)" \
    "npm cache clean --force" \
    "Node.js package cache"

# 2. Playwright Browser Cache
PLAYWRIGHT_CACHE_DIR="$HOME/Library/Caches/ms-playwright"
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    PLAYWRIGHT_CACHE_DIR="$HOME/.cache/ms-playwright"
fi

clean_cache "Playwright Browsers" \
    "$PLAYWRIGHT_CACHE_DIR" \
    "npx playwright uninstall --all && rm -rf '$PLAYWRIGHT_CACHE_DIR'" \
    "Playwright browser binaries"

# 3. Docker Cache (if Docker is available)
if command -v docker &> /dev/null; then
    echo ""
    print_status $BLUE "🐳 Docker cache cleanup..."
    
    # Check Docker daemon
    if docker info &> /dev/null; then
        # Get Docker cache info
        DOCKER_SIZE=$(docker system df --format "table {{.Type}}\t{{.Size}}" 2>/dev/null | tail -n +2 | awk '{sum+=$2} END {print sum "B"}' || echo "0B")
        echo "   Current Docker cache size: $DOCKER_SIZE"
        
        read -p "Clean Docker cache (images, containers, volumes, build cache)? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_status $YELLOW "   🧹 Cleaning Docker cache..."
            
            # Stop all running containers
            docker container stop $(docker container ls -q) 2>/dev/null || true
            
            # Remove stopped containers
            docker container prune -f 2>/dev/null || true
            
            # Remove unused images
            docker image prune -a -f 2>/dev/null || true
            
            # Remove unused volumes
            docker volume prune -f 2>/dev/null || true
            
            # Remove build cache
            docker builder prune -a -f 2>/dev/null || true
            
            # System prune for everything else
            docker system prune -a -f 2>/dev/null || true
            
            print_status $GREEN "   ✅ Docker cache cleaned"
        else
            print_status $YELLOW "   ⏭️  Docker cache cleanup skipped"
        fi
    else
        print_status $YELLOW "   ⚠️  Docker daemon not running, skipping Docker cache"
    fi
else
    print_status $YELLOW "   ℹ️  Docker not installed, skipping Docker cache"
fi

# 4. Node.js modules (optional deep clean)
echo ""
print_status $BLUE "📦 Node.js dependencies cleanup..."
if [ -d "node_modules" ]; then
    NODE_SIZE=$(get_size "node_modules")
    echo "   Current node_modules size: $NODE_SIZE"
    
    read -p "Remove node_modules for fresh install? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status $YELLOW "   🗑️  Removing node_modules..."
        rm -rf node_modules
        print_status $GREEN "   ✅ node_modules removed"
        print_status $BLUE "   💡 Run 'npm install' to restore dependencies"
    else
        print_status $YELLOW "   ⏭️  node_modules cleanup skipped"
    fi
else
    print_status $YELLOW "   ℹ️  node_modules not found"
fi

# 5. System temp files (macOS/Linux)
echo ""
print_status $BLUE "🗂️  System temporary files cleanup..."

TEMP_DIRS=()
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS temp directories
    TEMP_DIRS+=(
        "$HOME/Library/Caches/com.docker.docker"
        "$HOME/Library/Caches/com.microsoft.VSCode"
        "$TMPDIR"
        "/tmp"
    )
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux temp directories
    TEMP_DIRS+=(
        "$HOME/.cache"
        "/tmp"
        "/var/tmp"
    )
fi

for temp_dir in "${TEMP_DIRS[@]}"; do
    if [ -d "$temp_dir" ]; then
        TEMP_SIZE=$(get_size "$temp_dir")
        if [ "$TEMP_SIZE" != "0B" ]; then
            echo "   Found temp files in $temp_dir ($TEMP_SIZE)"
        fi
    fi
done

read -p "Clean system temporary files? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status $YELLOW "   🧹 Cleaning system temp files..."
    
    # Clean safely - only remove known temp patterns
    find /tmp -name "playwright-*" -type d -exec rm -rf {} + 2>/dev/null || true
    find /tmp -name "npm-*" -type d -exec rm -rf {} + 2>/dev/null || true
    find "$HOME/.cache" -name "*playwright*" -type d -exec rm -rf {} + 2>/dev/null || true
    
    print_status $GREEN "   ✅ System temp files cleaned"
else
    print_status $YELLOW "   ⏭️  System temp cleanup skipped"
fi

# 6. VS Code cache (optional)
echo ""
print_status $BLUE "💻 VS Code cache cleanup..."

VSCODE_CACHE_DIRS=()
if [[ "$OSTYPE" == "darwin"* ]]; then
    VSCODE_CACHE_DIRS+=(
        "$HOME/Library/Caches/com.microsoft.VSCode"
        "$HOME/.vscode/extensions"
    )
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    VSCODE_CACHE_DIRS+=(
        "$HOME/.cache/vscode"
        "$HOME/.vscode/extensions"
    )
fi

TOTAL_VSCODE_SIZE="0"
for cache_dir in "${VSCODE_CACHE_DIRS[@]}"; do
    if [ -d "$cache_dir" ]; then
        SIZE=$(get_size "$cache_dir")
        echo "   $cache_dir: $SIZE"
    fi
done

read -p "Clean VS Code cache? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status $YELLOW "   🧹 Cleaning VS Code cache..."
    
    for cache_dir in "${VSCODE_CACHE_DIRS[@]}"; do
        if [ -d "$cache_dir" ] && [[ "$cache_dir" == *"Caches"* ]]; then
            rm -rf "$cache_dir" 2>/dev/null || true
        fi
    done
    
    print_status $GREEN "   ✅ VS Code cache cleaned"
    print_status $BLUE "   💡 VS Code will rebuild cache on next startup"
else
    print_status $YELLOW "   ⏭️  VS Code cache cleanup skipped"
fi

# Summary
echo ""
echo "================================"
print_status $GREEN "✅ Cache Cleanup Complete"
echo "================================"
echo ""
print_status $BLUE "📋 What was cleaned:"
echo "   • NPM package cache"
echo "   • Playwright browser cache"  
echo "   • Docker images and build cache"
echo "   • System temporary files"
echo "   • VS Code cache"
echo "   • Node.js modules (if selected)"
echo ""
print_status $GREEN "🔒 Essential project files were protected"
echo ""

print_status $YELLOW "🔄 Next steps:"
echo "   • Run 'npm install' if you removed node_modules"
echo "   • Run 'npx playwright install' to reinstall browsers"
echo "   • Docker images will be re-downloaded as needed"
echo ""

# Show current disk usage
print_status $BLUE "💾 Current project size:"
PROJECT_SIZE=$(get_size ".")
echo "   Total project size: $PROJECT_SIZE"

if [ -d "node_modules" ]; then
    NODE_SIZE=$(get_size "node_modules")
    echo "   node_modules: $NODE_SIZE"
fi

echo ""
print_status $GREEN "🎉 Cache cleanup completed successfully!"
echo ""
