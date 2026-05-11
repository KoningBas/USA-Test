import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateFields } from '../api/lib/validate.js';

const VALID = {
  naam: 'Jan Janssen',
  adres: 'Dorpsstraat 1, Rijssen',
  email: 'jan@example.nl',
  telefoon: '06-12345678',
};

test('valid input returns empty errors array', () => {
  assert.deepEqual(validateFields(VALID), []);
});

test('missing naam returns naam error', () => {
  const errors = validateFields({ ...VALID, naam: '' });
  assert.ok(errors.includes('naam'));
  assert.equal(errors.length, 1);
});

test('naam of 1 character returns naam error', () => {
  const errors = validateFields({ ...VALID, naam: 'J' });
  assert.ok(errors.includes('naam'));
});

test('naam of 101 characters returns naam error', () => {
  const errors = validateFields({ ...VALID, naam: 'A'.repeat(101) });
  assert.ok(errors.includes('naam'));
});

test('missing adres returns adres error', () => {
  const errors = validateFields({ ...VALID, adres: '' });
  assert.ok(errors.includes('adres'));
});

test('adres of 4 characters returns adres error', () => {
  const errors = validateFields({ ...VALID, adres: 'ab 1' });
  assert.ok(errors.includes('adres'));
});

test('email without @ returns email error', () => {
  const errors = validateFields({ ...VALID, email: 'notanemail' });
  assert.ok(errors.includes('email'));
});

test('email without domain returns email error', () => {
  const errors = validateFields({ ...VALID, email: 'jan@' });
  assert.ok(errors.includes('email'));
});

test('missing telefoon returns telefoon error', () => {
  const errors = validateFields({ ...VALID, telefoon: '' });
  assert.ok(errors.includes('telefoon'));
});

test('telefoon of 3 digits returns telefoon error', () => {
  const errors = validateFields({ ...VALID, telefoon: '123' });
  assert.ok(errors.includes('telefoon'));
});

test('all invalid returns all four field errors', () => {
  const errors = validateFields({ naam: '', adres: '', email: '', telefoon: '' });
  assert.ok(errors.includes('naam'));
  assert.ok(errors.includes('adres'));
  assert.ok(errors.includes('email'));
  assert.ok(errors.includes('telefoon'));
  assert.equal(errors.length, 4);
});

test('whitespace-only naam returns naam error', () => {
  const errors = validateFields({ ...VALID, naam: '   ' });
  assert.ok(errors.includes('naam'));
});

test('email with 1-char second-level domain is valid (user@x.nl)', () => {
  const errors = validateFields({ ...VALID, email: 'user@x.nl' });
  assert.equal(errors.length, 0);
});

test('email with empty host (user@.nl) returns email error', () => {
  const errors = validateFields({ ...VALID, email: 'user@.nl' });
  assert.ok(errors.includes('email'));
});

test('adres of 201 characters returns adres error', () => {
  const errors = validateFields({ ...VALID, adres: 'A'.repeat(201) });
  assert.ok(errors.includes('adres'));
});

test('telefoon of 21 characters returns telefoon error', () => {
  const errors = validateFields({ ...VALID, telefoon: '0'.repeat(21) });
  assert.ok(errors.includes('telefoon'));
});
