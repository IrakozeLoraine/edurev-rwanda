import { test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './store/store';

vi.mock('./axios', () => {
    return {
        default: {
            get: vi.fn().mockResolvedValue({ data: [] }),
            post: vi.fn(),
            put: vi.fn(),
            delete: vi.fn(),
            interceptors: {
                request: { use: vi.fn() },
                response: { use: vi.fn() },
            },
        },
    };
});

test('shows EduRev Rwanda title', () => {
    render(
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    );

    expect(screen.getByText('EduRev Rwanda')).toBeInTheDocument();
});
