
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DashboardHeader from './DashboardHeader';

describe('DashboardHeader', () => {
  it('displays the welcome message', () => {
    render(<DashboardHeader />);
    expect(screen.getByText('WELCOME, ADMIN')).toBeInTheDocument();
  });

  it('renders the search input', () => {
    render(<DashboardHeader />);
    expect(screen.getByPlaceholderText('Find something')).toBeInTheDocument();
  });

  it('shows the current date', () => {
    render(<DashboardHeader />);
    expect(screen.getByText(/THURSDAY/)).toBeInTheDocument();
    expect(screen.getByText(/AUGUST 12, 2024/)).toBeInTheDocument();
  });
});