
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MembersTable from './MembersTable';

describe('MembersTable', () => {
  it('renders the members title', () => {
    render(<MembersTable />);
    expect(screen.getByText('MEMBERS')).toBeInTheDocument();
  });

  it('displays the search input for members', () => {
    render(<MembersTable />);
    expect(screen.getByPlaceholderText('search...')).toBeInTheDocument();
  });

  it('shows the add button', () => {
    render(<MembersTable />);
    expect(screen.getByText('Add')).toBeInTheDocument();
  });

  it('renders the table headers', () => {
    render(<MembersTable />);
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('NAME')).toBeInTheDocument();
    expect(screen.getByText('ACCOUNT ID')).toBeInTheDocument();
    expect(screen.getByText('TYPE')).toBeInTheDocument();
    expect(screen.getByText('STATUS')).toBeInTheDocument();
    expect(screen.getByText('ACTION')).toBeInTheDocument();
  });
});