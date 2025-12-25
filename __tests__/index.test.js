/* eslint-disable */
import '@testing-library/jest-dom';
import fs from 'fs';
import path from 'path';
import testingLibrary from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import nock from 'nock';
import run from '../src/index.js';

const { screen, waitFor } = testingLibrary;
nock.disableNetConnect();

let elements;

beforeEach(() => {
  const pathToFixture = path.join('__tests__', '__fixtures__', 'index.html');
  const initHtml = fs.readFileSync(pathToFixture).toString();
  document.body.innerHTML = initHtml;
  run();

  elements = {
    submit: screen.getByText(/Найти билеты/),
    whereInput: screen.getByRole('textbox', { name: /Откуда-Куда/ }),
    whenInput: screen.getByRole('textbox', { name: /Когда/ }),
  };
});

test('step1', async () => {
  const formContainer = document.querySelector('.container');
  expect(formContainer.querySelector('form')
    .querySelector('input[class="form-control"]')).not.toEqual(null);
});

test('step2', async () => {
  nock('http://localhost')
    .post('/tickets')
    .reply(200, {
      message: 'tickets has been found successfully'
    });

  await userEvent.clear(elements.whereInput);
  await userEvent.clear(elements.whenInput);
  await userEvent.type(elements.whereInput, 'G-G');
  await userEvent.type(elements.whenInput, '12.12');

  await userEvent.click(elements.submit);
  await waitFor(() => {
    expect(document.body).toHaveClass('bg-success');
  });
});

test('step3', async () => {
  const whereNotification = document.querySelector('#where-notification');
  const whenNotification = document.querySelector('#when-notification');

  await userEvent.clear(elements.whereInput);
  await userEvent.clear(elements.whenInput);
  await userEvent.type(elements.whereInput, 'П-П');
  await userEvent.type(elements.whenInput, '32.01');
  expect(whereNotification).toBeTruthy();
  expect(whenNotification).toBeTruthy();
  expect(whereNotification).toHaveClass('text-success');
  expect(whenNotification).toHaveClass('text-danger');

  await userEvent.clear(elements.whereInput);
  await userEvent.clear(elements.whenInput);
  await userEvent.type(elements.whereInput, 'П-П');
  await userEvent.type(elements.whenInput, '31.01');
  expect(whereNotification).toBeTruthy();
  expect(whenNotification).toBeTruthy();
  expect(whereNotification).toHaveClass('text-success');
  expect(whenNotification).toHaveClass('text-success');

  await userEvent.clear(elements.whereInput);
  await userEvent.clear(elements.whenInput);
  await userEvent.type(elements.whereInput, '  ');
  await userEvent.type(elements.whenInput, '12.12');
  expect(whereNotification).toBeTruthy();
  expect(whenNotification).toBeTruthy();
  expect(whereNotification).toHaveClass('text-danger');
  expect(whenNotification).toHaveClass('text-success');

  await userEvent.clear(elements.whereInput);
  await userEvent.clear(elements.whenInput);
  await userEvent.type(elements.whereInput, 'G-G');
  await userEvent.type(elements.whenInput, '12.12');
  expect(whereNotification).toBeTruthy();
  expect(whenNotification).toBeTruthy();
  expect(whereNotification).toHaveClass('text-success');
  expect(whenNotification).toHaveClass('text-success');
});


test('step4', async () => {
  await userEvent.type(elements.whereInput, 'Москва-Питер');
  await userEvent.type(elements.whenInput, '1.1111');
  expect(elements.submit).not.toHaveClass('btn-primary');
  expect(elements.submit).not.toHaveClass('bg-success');
  expect(elements.submit).toHaveClass('btn-danger');

  await userEvent.clear(elements.whereInput);
  await userEvent.clear(elements.whenInput);
  await userEvent.type(elements.whereInput, ' ');
  await userEvent.type(elements.whenInput, '12.12');
  expect(elements.submit).not.toHaveClass('btn-primary');
  expect(elements.submit).not.toHaveClass('bg-success');
  expect(elements.submit).toHaveClass('btn-danger');

  await userEvent.clear(elements.whereInput);
  await userEvent.clear(elements.whenInput);
  await userEvent.type(elements.whereInput, 'Москва-Питер');
  await userEvent.type(elements.whenInput, '12.12');
  expect(elements.submit).not.toHaveClass('btn-primary');
  expect(elements.submit).not.toHaveClass('btn-danger');
  expect(elements.submit).toHaveClass('bg-success');
});
