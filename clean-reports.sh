#!/bin/bash

# ================================
# Clean Reports Script
# ================================
# Removes all generated test reports and artifacts
# while preserving the directory structure
# 
# SAFETY FEATURES:
# - Only targets specific report directories
# - Protects essential project files
# - Pre-flight safety checks
# - Interactive confirmations

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

# Protected directories that should not be completely removed
PROTECTED_DIRS=(
    "src"
    "e2e"
    "node_modules"
    "build"
    ".git"
    ".github"
    ".vscode"
    "postman"
)

echo "================================"
echo "🧹 Cleaning Test Reports"
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
            echo "❌ Cleanup cancelled for safety"
            exit 1
        fi
    else
        echo "✅ All essential files present"
    fi
    echo ""
}

# Function to safely remove contents while preserving directory structure
clean_directory() {
    local dir="$1"
    local description="$2"
    
    if [ -d "$dir" ]; then
        echo "📁 Cleaning $description..."
        # Remove all files and subdirectories, but keep the parent directory
        find "$dir" -mindepth 1 -delete 2>/dev/null || true
        echo "   ✅ $description cleaned"
    else
        echo "   ⚠️  $description directory not found"
    fi
}

# Function to remove specific file types
clean_files() {
    local pattern="$1"
    local description="$2"
    
    echo "🗑️  Removing $description..."
    find . -name "$pattern" -type f -delete 2>/dev/null || true
    echo "   ✅ $description removed"
}

# Main cleanup operations
check_protected_files

echo ""
echo "Starting cleanup process..."
echo ""

# Clean main reports directory structure
clean_directory "reports/e2e" "E2E test reports"
clean_directory "reports/api" "API test reports"
clean_directory "reports/accessibility" "Accessibility reports"
clean_directory "reports/performance" "Performance reports"
clean_directory "reports/security" "Security reports"
clean_directory "reports/playwright" "Traditional Playwright reports"

# Clean artifacts
clean_directory "reports/artifacts/screenshots" "Screenshots"
clean_directory "reports/artifacts/videos" "Videos"
clean_directory "reports/artifacts/traces" "Traces"

# Clean other report locations
clean_directory "playwright-report" "Playwright HTML reports"
clean_directory "test-results" "Test result files"
clean_directory "artifacts" "Root artifacts directory"

# Clean specific file types ONLY in reports directories (safe approach)
echo "🗑️  Removing report files in specific directories..."

# Only clean files in reports-related directories to avoid deleting essential files
find reports/ -name "*.html" -type f -delete 2>/dev/null || true
find reports/ -name "*.json" -type f -delete 2>/dev/null || true
find reports/ -name "*.xml" -type f -delete 2>/dev/null || true
find reports/ -name "*.png" -type f -delete 2>/dev/null || true
find reports/ -name "*.jpg" -type f -delete 2>/dev/null || true
find reports/ -name "*.jpeg" -type f -delete 2>/dev/null || true
find reports/ -name "*.mp4" -type f -delete 2>/dev/null || true
find reports/ -name "*.webm" -type f -delete 2>/dev/null || true
find reports/ -name "*.zip" -type f -delete 2>/dev/null || true

find playwright-report/ -name "*.html" -type f -delete 2>/dev/null || true
find playwright-report/ -name "*.json" -type f -delete 2>/dev/null || true
find test-results/ -name "*.png" -type f -delete 2>/dev/null || true
find test-results/ -name "*.mp4" -type f -delete 2>/dev/null || true
find test-results/ -name "*.webm" -type f -delete 2>/dev/null || true
find test-results/ -name "*.zip" -type f -delete 2>/dev/null || true

echo "   ✅ Report files cleaned safely"

# Restore important JSON files that shouldn't be deleted
echo ""
echo "🔄 Restoring essential files..."

# Restore package files if accidentally deleted
if [ ! -f "package.json" ] && [ -f "package.json.bak" ]; then
    mv "package.json.bak" "package.json"
    echo "   ✅ package.json restored"
fi

if [ ! -f "package-lock.json" ] && [ -f "package-lock.json.bak" ]; then
    mv "package-lock.json.bak" "package-lock.json"
    echo "   ✅ package-lock.json restored"
fi

# Clean Docker containers and images related to testing (optional)
if command -v docker &> /dev/null; then
    echo ""
    echo "🐳 Docker cleanup (optional)..."
    read -p "Do you want to clean Docker test containers and images? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "   🗑️  Stopping and removing test containers..."
        docker container prune -f 2>/dev/null || true
        
        echo "   🗑️  Removing unused test images..."
        docker image prune -f 2>/dev/null || true
        
        # Remove specific playwright-mcp-server images if they exist
        if docker images | grep -q "playwright-mcp-server"; then
            docker rmi $(docker images "playwright-mcp-server" -q) 2>/dev/null || true
            echo "   ✅ Playwright MCP server images removed"
        fi
        
        echo "   ✅ Docker cleanup completed"
    else
        echo "   ⏭️  Docker cleanup skipped"
    fi
fi

# Clean node_modules cache (optional)
echo ""
echo "📦 Node.js cleanup (optional)..."
read -p "Do you want to clean node_modules and npm cache? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "   🗑️  Removing node_modules..."
    rm -rf node_modules
    
    echo "   🗑️  Cleaning npm cache..."
    npm cache clean --force 2>/dev/null || true
    
    echo "   ✅ Node.js cleanup completed"
    echo "   💡 Run 'npm install' to restore dependencies"
else
    echo "   ⏭️  Node.js cleanup skipped"
fi

# Summary
echo ""
echo "================================"
echo "✅ Cleanup Summary"
echo "================================"
echo "🧹 All test reports and artifacts have been cleaned"
echo "📁 Directory structure preserved"
echo "� Essential project files protected"
echo "�🔄 Ready for fresh test runs"
echo ""

# Display current disk usage of reports directory
if [ -d "reports" ]; then
    REPORT_SIZE=$(du -sh reports 2>/dev/null | cut -f1 || echo "0B")
    echo "📊 Current reports directory size: $REPORT_SIZE"
fi

echo ""
echo "🚀 You can now run fresh tests:"
echo "   npm run smoke"
echo "   npm run accessibility"
echo "   ./docker-test.sh smoke"
echo "   ./docker-test.sh api"
echo ""
