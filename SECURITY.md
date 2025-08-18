# Security Guidelines

## Docker Security Enhancements

### Base Image Security
- **Updated Base Image**: Changed from `node:20-bullseye-slim` to `node:20-bookworm-slim`
  - Bookworm (Debian 12) includes latest security patches
  - Addresses 2 high vulnerabilities identified in bullseye-slim

### Container Security Practices
- **Non-Root User**: Container runs as `playwright` user (not root)
- **System Updates**: Automatic security patch installation via `apt-get upgrade`
- **Minimal Attack Surface**: Slim image with only required dependencies
- **Clean Environment**: Proper cleanup of package caches and temporary files

### Security Scanning
- Use Docker Scout or similar tools for vulnerability scanning
- Regular base image updates recommended
- Monitor for new CVEs affecting Node.js and system packages

## Development Security

### VS Code Extensions
- **Docker Extension**: `ms-azuretools.vscode-docker` for container management
- **Remote Containers**: `ms-vscode-remote.remote-containers` for secure development
- **ESLint**: `dbaeumer.vscode-eslint` for code quality and security linting

### Best Practices
1. **Regular Updates**: Keep dependencies and base images updated
2. **Principle of Least Privilege**: Use non-root containers
3. **Vulnerability Scanning**: Integrate security scanning in CI/CD
4. **Secret Management**: Never commit secrets to repository
5. **Network Security**: Use least-privilege network policies

## Security Checklist

- [ ] Base image updated to latest secure version
- [ ] Container runs as non-root user
- [ ] Security patches applied (`apt-get upgrade`)
- [ ] No secrets in Dockerfile or environment variables
- [ ] Regular vulnerability scanning enabled
- [ ] Dependencies regularly updated via `npm audit`

## Reporting Security Issues

If you discover a security vulnerability, please report it privately by emailing the maintainers.
