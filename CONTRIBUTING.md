# Contributing to Prompt Architect

Thank you for your interest in contributing to Prompt Architect! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/prompt-architect.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Commit your changes: `git commit -m 'Add some feature'`
6. Push to the branch: `git push origin feature/your-feature-name`
7. Open a Pull Request

## Development Setup

1. Install dependencies: `npm install`
2. Start Ollama: `ollama serve`
3. Run the app: `npm run electron:dev`

## Code Style

- Use TypeScript for all new code
- Follow the existing code style
- Use ESLint and fix any linting errors
- Write meaningful commit messages
- Use functional components and hooks in React
- Follow the project's naming conventions

## Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Example: `feat: add multi-language support for UI`

## Pull Request Process

1. Update the README.md with details of changes if needed
2. Ensure your code follows the project's style guidelines
3. Test your changes thoroughly
4. Update documentation as needed
5. Ensure all linting checks pass
6. The PR will be reviewed and merged if approved

## Reporting Issues

When reporting issues, please include:

- Description of the issue
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- System information (OS, Node version, Ollama version, etc.)

## Feature Requests

Feature requests are welcome! Please open an issue with:

- Clear description of the feature
- Use case and motivation
- Potential implementation approach (if you have ideas)

## Internationalization (i18n)

When adding new UI text:

1. Add translations to all locale files:
   - `src/i18n/locales/en.ts`
   - `src/i18n/locales/tr.ts`
   - `src/i18n/locales/de.ts`
   - `src/i18n/locales/fi.ts`

2. Use the `useTranslation` hook in components:
```typescript
import { useTranslation } from '../hooks/useTranslation';

const MyComponent = () => {
  const { t } = useTranslation();
  return <div>{t('my.key')}</div>;
};
```

## Testing

- Test your changes manually before submitting
- Ensure the app works in both development and production builds
- Test with different Ollama models if applicable

## Questions?

If you have questions, feel free to open an issue or start a discussion.

Thank you for contributing! 🎉
