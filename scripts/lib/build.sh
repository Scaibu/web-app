#!/usr/bin/env bash

# Build Verification & Dependency Installation Module

cmd_install_deps() {
  ensure_app_dir
  if [ "$1" = "--clean" ] || [ "$1" = "-c" ]; then
    clean_deep_artifacts
  fi
  log_info "Installing and updating dependencies..."
  npm install && npm update
  if [ -d "$SCRIPT_DIR/../../design-tokens" ]; then
    (cd "$SCRIPT_DIR/../../design-tokens" && node build.js) || true
  fi
  log_success "Dependencies installed and updated successfully."
}

cmd_reinstall_all() {
  ensure_app_dir
  log_info "Deleting all old node_modules and build artifacts..."
  rm -rf node_modules package-lock.json .next
  if [ -d "$SCRIPT_DIR/../../shared-infra" ]; then
    rm -rf "$SCRIPT_DIR/../../shared-infra/node_modules"
  fi
  if [ -d "$SCRIPT_DIR/../../auth" ]; then
    rm -rf "$SCRIPT_DIR/../../auth/node_modules"
  fi

  log_info "Reinstalling fresh dependencies..."
  if [ -d "$SCRIPT_DIR/../../shared-infra" ]; then
    log_info "Installing shared-infra dependencies..."
    (cd "$SCRIPT_DIR/../../shared-infra" && npm install --no-audit --no-fund)
  fi
  if [ -d "$SCRIPT_DIR/../../design-tokens" ]; then
    log_info "Building design tokens..."
    (cd "$SCRIPT_DIR/../../design-tokens" && node build.js) || true
  fi
  log_info "Installing web-app dependencies..."
  npm install --no-audit --no-fund
  log_success "All packages cleaned and reinstalled successfully!"
}

cmd_build_verify() {
  ensure_app_dir
  log_info "Running build verification pipeline..."
  clean_build_artifacts
  log_warn "Running typecheck..."
  npx tsc --noEmit
  log_warn "Running lint..."
  npx eslint
  log_warn "Building Next.js app..."
  npx next build
  log_success "Verification completed successfully!"
}
