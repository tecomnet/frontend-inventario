// Setup de las pruebas del front (mismo esquema que frontendRecargas).
//
// Con `globals: true` Testing Library desmonta solo lo que pinta cada prueba;
// aquí solo se agregan los matchers de jest-dom (toBeInTheDocument,
// toBeDisabled...) y se restauran los mocks, fetch incluido, para que no se
// filtren entre pruebas.
import { configure } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';

configure({ asyncUtilTimeout: 3000 });
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});
