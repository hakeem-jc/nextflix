import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Input from './Input';

describe('Input', () => {
  const onChangeMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the input element with the correct attributes', () => {
    const id = 'input-id';
    const label = 'Test Input';
    const value = 'test value';
    const type = 'text';

    render(
      <Input id={id} onChange={onChangeMock} value={value} label={label} type={type} />
    );

    const inputElement = screen.getByLabelText(label);
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('type', type);
    expect(inputElement).toHaveAttribute('id', id);
    expect(inputElement).toHaveValue(value);
  });

  it('calls onChange callback when the input value changes', () => {
    const id = 'input-id';
    const label = 'Test Input';
    const value = 'test value';
    const type = 'text';

    render(
      <Input id={id} onChange={onChangeMock} value={value} label={label} type={type} />
    );

    const inputElement = screen.getByLabelText(label);
    const newValue = 'new value';

    fireEvent.change(inputElement, { target: { value: newValue } });
    expect(onChangeMock).toHaveBeenCalledTimes(1);
    expect(onChangeMock).toHaveBeenCalledWith(expect.any(Object));
  });

});
