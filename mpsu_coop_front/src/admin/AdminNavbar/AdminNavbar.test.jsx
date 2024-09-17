import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AdminNavbar from './AdminNavbar';

describe('AdminNavbar', () => {
  it('renders the logo text', () => {
    render(<AdminNavbar />);
    expect(screen.getByText('MPSPC CREDIT COOP')).toBeInTheDocument();
  });

  it('displays all navigation items', () => {
    render(<AdminNavbar />);
    expect(screen.getAllByRole('img')).toHaveLength(9); 
  });

  it('shows the logout option', () => {
    render(<AdminNavbar />);
    expect(screen.getByText('Log out')).toBeInTheDocument();
  });
});