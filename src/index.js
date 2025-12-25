import axios from 'axios';

const isValidWhere = (value) => {
  const regex = /^[A-Za-zА-Яа-я]+-[A-Za-zА-Яа-я]+$/;
  return regex.test(value);
};

const isValidWhen = (value) => {
  const regex = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])$/;
  return regex.test(value);
};

export default function initForm() {
  const container = document.querySelector('.container');
  const h2 = container.querySelector('h2');

  const form = document.createElement('form');
  form.innerHTML = `
    <div class="mb-3">
      <label for="where" class="form-label">Откуда-Куда</label>
      <input autocomplete="off" type="text" class="form-control" id="where" placeholder="Введите город">
      <p id="where-notification"></p>
    </div>
    <div class="mb-3">
      <label for="when" class="form-label">Когда</label>
      <input autocomplete="off" type="text" class="form-control" id="when" placeholder="Введите число и месяц">
      <p id="when-notification"></p>
    </div>
    <button type="submit" class="btn btn-primary" id="submit-btn">Найти билеты</button>
  `;

  h2.after(form);

  const whereInput = form.querySelector('#where');
  const whenInput = form.querySelector('#when');
  const whereNote = form.querySelector('#where-notification');
  const whenNote = form.querySelector('#when-notification');
  const submitBtn = form.querySelector('#submit-btn');

  let whereValid = false;
  let whenValid = false;

  const updateButton = () => {
    submitBtn.classList.remove('btn-primary', 'btn-danger', 'bg-success');

    if (whereValid && whenValid) {
      submitBtn.classList.add('bg-success');
    } else {
      submitBtn.classList.add('btn-danger');
    }
  };

  whereInput.addEventListener('input', (e) => {
    whereValid = isValidWhere(e.target.value);

    whereNote.className = whereValid ? 'text-success' : 'text-danger';
    whereNote.textContent = whereValid
      ? 'Город введён корректно'
      : 'Введите в формате Москва-Питер';

    updateButton();
  });

  whenInput.addEventListener('input', (e) => {
    whenValid = isValidWhen(e.target.value);

    whenNote.className = whenValid ? 'text-success' : 'text-danger';
    whenNote.textContent = whenValid
      ? 'Дата введена корректно'
      : 'Введите дату в формате ДД.ММ';

    updateButton();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!whereValid || !whenValid) {
      return;
    }

    const data = {
      where: whereInput.value,
      when: whenInput.value,
    };

    axios.post('/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.status === 200) {
          document.body.className = 'bg-success';
        }
      });
  });
} 