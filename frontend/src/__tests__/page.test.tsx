import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '@/app/page';

jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
  },
  Toaster: () => null,
}));

jest.mock('@/app/components/NpvChart');

describe('Home Component', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('renders the form and initial values correctly', () => {
    render(<Home />);
    
    expect(screen.getByRole('heading', { name: /npv calculator/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/cash flows/i)).toHaveValue("-100000, 25000, 30000, 35000, 40000");
    expect(screen.getByTestId('npv-chart-mock')).toBeInTheDocument();
  });

  test('shows validation error if cash flows are empty', async () => {
    render(<Home />);
    
    fireEvent.change(screen.getByLabelText(/cash flows/i), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: /calculate npv/i }));

    const errorMessage = await screen.findByText(/at least one cash flow is required/i);
    expect(errorMessage).toBeInTheDocument();
  });

  test('submits the form and displays loading state', async () => {
    global.fetch = jest.fn(() => new Promise(() => {}));
    
    render(<Home />);

    fireEvent.click(screen.getByRole('button', { name: /calculate npv/i }));
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /calculating/i })).toBeInTheDocument();
    });
  });

  test('handles API error and displays a toast message', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
        ok: false,
        text: () => Promise.resolve("Server error occurred"),
    } as Response));

    render(<Home />);

    fireEvent.click(screen.getByRole('button', { name: /calculate npv/i }));

    await waitFor(() => {
        const { toast } = require('sonner');
        expect(toast.error).toHaveBeenCalledWith("Server error occurred");
    });
  });
});