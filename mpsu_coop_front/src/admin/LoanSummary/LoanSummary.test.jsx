
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LoanSummary from './LoanSummary';

describe('LoanSummary', () => {
  it('renders three loan cards', () => {
    render(<LoanSummary />);
    const loanCards = screen.getAllByText('REGULAR LOAN');
    expect(loanCards).toHaveLength(4);
  });

  it('displays the loan amount for each card', () => {
    render(<LoanSummary />);
    const loanAmounts = screen.getAllByText('500,000');
    expect(loanAmounts).toHaveLength(4);
  });
});