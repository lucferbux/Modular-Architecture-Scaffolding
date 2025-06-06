# Modular Architecture Overview

## Introduction

The Model Registry UI represents a strategic implementation of a **Modular Architecture Initiative** designed for the MLOps platform ecosystem. This architecture establishes a reusable, scalable foundation that can be leveraged across multiple components within the broader MLOps platform, providing consistency, maintainability, and enhanced developer experience.

## Architecture Overview

The Model Registry UI implements a modern **Backend for Frontend (BFF)** pattern with a React-based frontend, creating a modular architecture that serves as a blueprint for other components in the MLOps platform.

### High-Level Architecture

```
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│                     │    │                     │    │                     │
│   React Frontend    │────│   Go BFF Server     │────│ Model Registry API  │
│                     │    │                     │    │                     │
│ - PatternFly UI     │    │ - REST API Layer    │    │ - gRPC Backend      │
│ - Module Federation │    │ - K8s Integration   │    │ - ML Metadata       │
│ - Shared Components │    │ - Auth Middleware   │    │ - Data Storage      │
│                     │    │                     │    │                     │
└─────────────────────┘    └─────────────────────┘    └─────────────────────┘
```

## Core Components

### 1. Frontend Layer (`/frontend`)

**Technology Stack:**
- **React 18** with TypeScript
- **PatternFly 6.x** for consistent UI components
- **Webpack Module Federation** for microfrontend capabilities
- **React Router 7.x** for navigation
- **Emotion** for styling

**Key Features:**
- **Modular Component Architecture**: Utilizes `mod-arch-shared` library for common components
- **Context-Based State Management**: Implements specialized context providers for different concerns
- **Responsive Design**: Built with accessibility and mobile-first principles
- **Module Federation Ready**: Configured for microfrontend integration

**Architecture Patterns:**
```typescript
// Context Providers for Modular State Management
<ModularArchContextProvider config={modularArchConfig}>
  <ThemeProvider theme={STYLE_THEME}>
    <BrowserStorageContextProvider>
      <NotificationContextProvider>
        <App />
      </NotificationContextProvider>
    </BrowserStorageContextProvider>
  </ThemeProvider>
</ModularArchContextProvider>
```

### 2. Backend for Frontend (BFF) Layer (`/bff`)

**Technology Stack:**
- **Go 1.24.3** for high-performance server
- **REST API** with OpenAPI specification
- **Kubernetes Client** for cluster integration
- **gRPC Client** for Model Registry communication

**Key Responsibilities:**
- **API Aggregation**: Combines multiple backend services into unified endpoints
- **Authentication & Authorization**: Handles user authentication and namespace-based authorization
- **Request Transformation**: Converts frontend requests to appropriate backend calls
- **Error Handling**: Provides consistent error responses to the frontend
- **Kubernetes Integration**: Direct integration with Kubernetes APIs for namespace and resource management

**API Structure:**
```
/api/v1/
├── healthcheck          # Health monitoring
├── namespaces          # K8s namespace management
├── user                # User configuration
├── model_registry      # Model registry operations
└── settings/           # Configuration management
```

### 3. API Definition Layer (`/api`)

**OpenAPI Specification (`mod-arch.yaml`):**
- **Comprehensive API Documentation**: 1900+ lines of detailed API specifications
- **Type-Safe Contracts**: Ensures consistency between frontend and backend
- **Validation Rules**: Built-in request/response validation
- **Development Tools**: Supports code generation and testing

## Modular Architecture Patterns

### 1. Shared Component Library (`mod-arch-shared`)

The `mod-arch-shared` package serves as the foundation for modular architecture:
a
**Core Utilities:**
- **Context Providers**: Standardized state management patterns
- **API Utilities**: Common REST API handling (`restGET`, `restPOST`, `restPATCH`, `restDELETE`)
- **UI Components**: Reusable PatternFly-based components
- **Type Definitions**: Shared TypeScript interfaces and types
- **Configuration Management**: Standardized configuration patterns

**Benefits:**
- **Consistency**: Ensures uniform behavior across different MLOps components
- **Reusability**: Reduces code duplication across projects
- **Maintainability**: Centralized updates benefit all consuming applications
- **Developer Experience**: Standardized patterns reduce learning curve

### 2. Deployment Modes

The architecture supports two primary deployment modes:

#### Standalone Mode
- **Use Case**: Local development and standalone deployments
- **Characteristics**:
  - BFF serves both API and static assets
  - Direct authentication via `kubeflow-userid` header
  - Namespace selection through `/namespaces` endpoint
  - Simplified deployment model

#### Integrated Mode
- **Use Case**: Integration with Kubeflow Central Dashboard
- **Characteristics**:
  - UI served by Kubeflow Ingress
  - BFF served by Kubeflow API Gateway
  - Authentication handled by Kubeflow
  - Namespace context from Kubeflow environment

### 3. Module Federation Architecture

**Microfrontend Capabilities:**
```javascript
// Module Federation Configuration
const moduleFederationConfig = {
  name: 'modelRegistry',
  filename: 'remoteEntry.js',
  shared: {
    react: { singleton: true, eager: true },
    'react-dom': { singleton: true, eager: true },
    'react-router': { singleton: true, eager: true },
    'react-router-dom': { singleton: true, eager: true },
  },
  exposes: {
    // Future: Expose components for other MLOps modules
  },
  runtime: false,
};
```

**Benefits:**
- **Independent Deployments**: Each module can be deployed independently
- **Shared Dependencies**: Efficient resource utilization through shared libraries
- **Runtime Integration**: Dynamic loading of remote modules
- **Scalable Architecture**: Supports large-scale MLOps platform development

## Configuration Management

### Environment Variables

The architecture uses a layered configuration approach:

```bash
# Container and Build Configuration
CONTAINER_TOOL=docker|podman
IMG_UI=ghcr.io/kubeflow/model-registry/ui:latest
IMG_UI_STANDALONE=ghcr.io/kubeflow/model-registry/ui-standalone:latest
PLATFORM=linux/amd64

# Deployment Configuration
DEPLOYMENT_MODE=standalone|integrated
BFF_API_VERSION=v1
URL_PREFIX=/model-registry
```

### Configuration Files

**Frontend Configuration:**
- `.env.development` - Development-specific settings
- `.env.production` - Production optimizations
- `.env.local` - Local overrides (gitignored)

**BFF Configuration:**
- Command-line flags for runtime configuration
- Environment variable integration
- Kubernetes ConfigMap support

## Development Workflow

### Local Development Setup

**Prerequisites:**
- Node.js 20+ for frontend development
- Go 1.24.3+ for BFF development
- Docker for containerization
- kubectl for Kubernetes interaction

**Development Commands:**
```bash
# Frontend development
cd frontend
npm ci
npm run start:dev

# BFF development
cd bff
make run DEV_MODE=true

# Full stack development
make run  # Runs both frontend and BFF
```

### Build and Deployment

**Docker Multi-Stage Build:**
```dockerfile
# UI build stage
FROM node:20 AS ui-builder
WORKDIR /usr/src/app
COPY frontend/ .
RUN npm ci --omit=optional && npm run build:prod

# BFF build stage  
FROM golang:1.24.3 AS bff-builder
WORKDIR /workspace
COPY bff/ .
RUN go build -o manager main.go

# Final runtime stage
FROM gcr.io/distroless/static:nonroot
COPY --from=ui-builder /usr/src/app/dist ./ui
COPY --from=bff-builder /workspace/manager .
```

**Build Targets:**
- `docker-build` - Standard Docker build
- `docker-buildx` - Multi-architecture build
- `docker-build-standalone` - Standalone mode build
- `docker-push` - Push to registry

## Testing Strategy

### Frontend Testing

**Unit Testing:**
- **Jest** for component and utility testing
- **React Testing Library** for component interaction testing
- **TypeScript** for compile-time type checking

**End-to-End Testing:**
- **Cypress** for full application workflow testing
- **Mock API Integration** for isolated frontend testing
- **Accessibility Testing** with cypress-axe

**Test Commands:**
```bash
npm run test:unit          # Unit tests
npm run test:cypress-ci    # E2E tests
npm run test:lint          # Code quality
npm run test:type-check    # TypeScript validation
```

### BFF Testing

**Integration Testing:**
- Go testing framework for API endpoint testing
- Kubernetes API mocking for cluster integration tests
- gRPC client testing for Model Registry communication

**Linting and Quality:**
```bash
make lint  # golangci-lint for code quality
```

## Security Considerations

### Authentication and Authorization

**Standalone Mode:**
- Header-based authentication (`kubeflow-userid`)
- Namespace-based resource isolation
- BFF handles authorization logic

**Integrated Mode:**
- Kubeflow authentication integration
- RBAC through Kubernetes
- Istio service mesh security

### API Security

**Request Validation:**
- OpenAPI schema validation
- Input sanitization in BFF layer
- CORS configuration for cross-origin requests

**Transport Security:**
- HTTPS/TLS for external communication
- mTLS for internal service communication
- Secure headers configuration

## Scalability and Performance

### Frontend Optimization

**Build Optimization:**
- **Webpack Code Splitting**: Reduces initial bundle size
- **Module Federation**: Enables efficient code sharing
- **CSS Optimization**: PatternFly optimizations and tree shaking
- **Asset Optimization**: Image compression and caching

**Runtime Performance:**
- **React 18 Features**: Concurrent rendering and Suspense
- **Virtual Scrolling**: For large data sets
- **Memoization**: Strategic use of React.memo and useMemo
- **Bundle Analysis**: webpack-bundle-analyzer for size monitoring

### BFF Optimization

**Go Performance:**
- **Goroutines**: Concurrent request handling
- **Connection Pooling**: Efficient gRPC connection management
- **Caching**: Strategic caching of Kubernetes API responses
- **Memory Management**: Optimized for low memory footprint

## Monitoring and Observability

### Health Monitoring

**Health Endpoints:**
- `/healthcheck` - Basic health status
- Application metrics through structured logging
- Kubernetes probes integration

**Logging Strategy:**
- Structured logging with configurable levels
- Request correlation IDs
- Performance metrics logging

### Error Handling

**Frontend Error Boundaries:**
- React Error Boundaries for component error isolation
- User-friendly error messages
- Error reporting and analytics integration

**BFF Error Handling:**
- Structured error responses
- Proper HTTP status codes
- Error propagation from backend services

## Future Roadmap

### Planned Enhancements

**Architecture Evolution:**
1. **Enhanced Module Federation**: Exposing components for other MLOps modules
2. **GraphQL Integration**: Unified data layer for complex queries
3. **Real-time Updates**: WebSocket integration for live data updates
4. **Offline Capabilities**: PWA features for offline functionality

**Platform Integration:**
1. **Multi-Registry Support**: Enhanced support for multiple model registries
2. **Advanced Analytics**: Built-in analytics and reporting capabilities
3. **Plugin Architecture**: Extensible plugin system for custom functionality
4. **AI/ML Workflows**: Integration with broader ML workflow tools

### Migration Path

**For New MLOps Components:**
1. **Adopt mod-arch-shared**: Use shared component library
2. **Follow BFF Pattern**: Implement Go-based BFF for API aggregation
3. **Module Federation**: Configure for microfrontend integration
4. **Standardize Deployment**: Use common deployment patterns

**For Existing Components:**
1. **Gradual Migration**: Incremental adoption of modular patterns
2. **Shared Component Integration**: Replace custom components with shared ones
3. **API Standardization**: Align APIs with established patterns
4. **Deployment Harmonization**: Standardize build and deployment processes

## Conclusion

The Model Registry UI's modular architecture represents a strategic foundation for the MLOps platform ecosystem. By implementing standardized patterns, shared components, and flexible deployment models, it provides a blueprint for building scalable, maintainable, and consistent user experiences across the entire MLOps platform.

The architecture's emphasis on modularity, reusability, and developer experience positions it as a cornerstone for future MLOps component development, enabling rapid development while maintaining high standards of quality and consistency.

## Related Documentation

- [Local Deployment Guide](./local-deployment-guide.md)
- [Local UI Deployment Guide](./local-deployment-guide-ui.md) 
- [Kubeflow Development Guide](./kubeflow-development-guide.md)
- [Contributing Guidelines](../CONTRIBUTING.md)
- [Frontend Architecture Documentation](../frontend/docs/architecture.md)
