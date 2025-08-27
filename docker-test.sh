#!/bin/bash

# Comprehensive Docker Test Runner for Playwright MCP Server
set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check Docker
if ! docker info >/dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker."
    exit 1
fi

# Create necessary directories
create_dirs() {
    mkdir -p reports/e2e reports/api reports/artifacts/screenshots reports/artifacts/videos reports/artifacts/traces test-results
}

# Handle commands
case "${1:-help}" in
    "build")
        print_header "Building Playwright MCP Server"
        docker-compose build
        print_success "Build complete"
        ;;
    
    "test"|"all")
        print_header "Running All Tests"
        create_dirs
        docker-compose up --build playwright-tests
        print_success "All tests complete"
        ;;
    
    # Individual Test Types
    "smoke")
        print_header "Running Smoke Tests"
        create_dirs
        docker-compose --profile smoke up --build
        print_success "Smoke tests complete"
        ;;
    
    "functional")
        print_header "Running Functional Tests"
        create_dirs
        docker-compose --profile functional up --build
        print_success "Functional tests complete"
        ;;
    
    "performance")
        print_header "Running Performance Tests"
        create_dirs
        docker-compose --profile performance up --build
        print_success "Performance tests complete"
        ;;
    
    "accessibility")
        print_header "Running Accessibility Tests"
        create_dirs
        docker-compose --profile accessibility up --build
        print_success "Accessibility tests complete"
        ;;
    
    "security")
        print_header "Running Security Tests"
        create_dirs
        docker-compose --profile security up --build
        print_success "Security tests complete"
        ;;
    
    "api")
        print_header "Running API Tests"
        create_dirs
        docker-compose --profile api up --build
        print_success "API tests complete"
        ;;
    
    # Test Suites
    "suite-content")
        print_header "Running Content Test Suite"
        create_dirs
        docker-compose --profile suite-content up --build
        print_success "Content suite tests complete"
        ;;
    
    "suite-quality")
        print_header "Running Quality Test Suite"
        create_dirs
        docker-compose --profile suite-quality up --build
        print_success "Quality suite tests complete"
        ;;
    
    "suite-all")
        print_header "Running All Test Suites"
        create_dirs
        docker-compose --profile suite-all up --build
        print_success "All suite tests complete"
        ;;
    
    "orchestrated")
        print_header "Running Orchestrated Comprehensive Tests"
        create_dirs
        docker-compose --profile orchestrated up --build
        print_success "Orchestrated tests complete"
        ;;
    
    "clean")
        print_header "Cleaning Up"
        docker-compose down --volumes --remove-orphans
        docker system prune -f
        print_success "Cleanup complete"
        ;;
    
    "status")
        print_header "Docker Status"
        docker-compose ps
        echo ""
        docker images | grep playwright-mcp || print_info "No Playwright MCP images found"
        ;;
    
    "logs")
        if [ -n "$2" ]; then
            print_header "Viewing Logs for $2"
            docker-compose logs "$2"
        else
            print_header "Viewing All Logs"
            docker-compose logs
        fi
        ;;
    
    "artifacts")
        print_header "Collecting Test Artifacts"
        create_dirs
        
        # Create organized artifact structure
        timestamp=$(date +"%Y%m%d-%H%M%S")
        artifact_dir="artifacts/run-$timestamp"
        mkdir -p "$artifact_dir"
        
        # Copy all test results to unified artifact location
        [ -d "e2e/reports" ] && cp -r e2e/reports/* "$artifact_dir/" 2>/dev/null || true
        [ -d "postman/reports" ] && cp -r postman/reports/* "$artifact_dir/" 2>/dev/null || true
        [ -d "playwright-report" ] && cp -r playwright-report/* "$artifact_dir/" 2>/dev/null || true
        [ -d "test-results" ] && cp -r test-results/* "$artifact_dir/" 2>/dev/null || true
        
        # Create artifact summary
        echo "Test Run: $(date)" > "$artifact_dir/run-summary.txt"
        echo "Docker Image: playwright-mcp-server:latest" >> "$artifact_dir/run-summary.txt"
        echo "Artifacts collected from:" >> "$artifact_dir/run-summary.txt"
        echo "  - E2E Reports: $(ls e2e/reports 2>/dev/null | wc -l) files" >> "$artifact_dir/run-summary.txt"
        echo "  - Postman Reports: $(ls postman/reports 2>/dev/null | wc -l) files" >> "$artifact_dir/run-summary.txt"
        echo "  - Playwright Reports: $(ls playwright-report 2>/dev/null | wc -l) files" >> "$artifact_dir/run-summary.txt"
        echo "  - Test Results: $(ls test-results 2>/dev/null | wc -l) files" >> "$artifact_dir/run-summary.txt"
        
        print_success "Artifacts collected in: $artifact_dir"
        print_info "View summary: cat $artifact_dir/run-summary.txt"
        ;;
    
    "help"|*)
        echo "Comprehensive Docker Test Runner for Playwright MCP Server"
        echo ""
        echo "Individual Test Commands:"
        echo "  build        - Build Docker images"
        echo "  test|all     - Run all tests (default service)"
        echo "  smoke        - Run smoke tests only"
        echo "  functional   - Run functional tests only"
        echo "  performance  - Run performance tests only"
        echo "  accessibility- Run accessibility tests only"
        echo "  security     - Run security tests only"
        echo "  api          - Run API tests only"
        echo ""
        echo "Test Suite Commands:"
        echo "  suite-content - Run content validation suite"
        echo "  suite-quality - Run quality assurance suite"
        echo "  suite-all     - Run all comprehensive test suites"
        echo "  orchestrated  - Run orchestrated comprehensive tests"
        echo ""
        echo "Utility Commands:"
        echo "  clean        - Clean up containers and images"
        echo "  status       - Show Docker status and containers"
        echo "  logs [name]  - Show logs (optionally for specific service)"
        echo "  artifacts    - Collect all test artifacts in organized structure"
        echo ""
        echo "Examples:"
        echo "  ./docker-test.sh build"
        echo "  ./docker-test.sh test"
        echo "  ./docker-test.sh smoke"
        echo "  ./docker-test.sh suite-quality"
        echo "  ./docker-test.sh logs api-tests"
        echo "  docker-compose up  # Direct approach (all tests)"
        echo ""
        echo "Profile Usage:"
        echo "  docker-compose --profile smoke up --build"
        echo "  docker-compose --profile accessibility up --build"
        echo "  docker-compose --profile suite-quality up --build"
        ;;
esac
