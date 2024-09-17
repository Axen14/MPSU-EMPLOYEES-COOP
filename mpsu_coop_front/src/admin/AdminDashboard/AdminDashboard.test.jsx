import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AdminDashboard from './AdminDashboard';

describe('AdminDashboard', () => {
  it('renders without crashing', () => {
    render(<AdminDashboard />);
    expect(screen.getByText('WELCOME, ADMIN')).toBeInTheDocument();
  });

  it('displays the correct date', () => {
    render(<AdminDashboard />);
    expect(screen.getByText(/THURSDAY/)).toBeInTheDocument();
    expect(screen.getByText(/AUGUST 12, 2024/)).toBeInTheDocument();
  });

  it('shows the stats container', () => {
    render(<AdminDashboard />);
    expect(screen.getAllByText('REGULAR LOAN')).toHaveLength(3);
  });

  it('displays the members table', () => {
    render(<AdminDashboard />);
    expect(screen.getByText('MEMBERS')).toBeInTheDocument();
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('AMNAMEOUNT')).toBeInTheDocument();
    expect(screen.getByText('ACCOUNT ID')).toBeInTheDocument();
  });

  it('shows the admin navbar', () => {
    render(<AdminDashboard />);
    expect(screen.getByText('MPSPC CREDIT COOP')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Deposit')).toBeInTheDocument();
    expect(screen.getByText('Log out')).toBeInTheDocument();
  });
});