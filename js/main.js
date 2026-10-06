// =========================================================
// Общая функция проверки и «отправки» формы.
// Используется и для формы в модальном окне (index.html),
// и для формы предзаказа (order.html).
// =========================================================
function setupForm(form, successMessage, onSuccess) {
  form.addEventListener('submit', (event) => {
    // Отменяем стандартную отправку формы,
    // потому что backend пока не подключён.
    event.preventDefault();

    // Сбрасываем предыдущие признаки ошибок.
    const formElements = Array.from(form.elements);

    formElements.forEach((element) => {
      if (element.willValidate) {
        element.removeAttribute('aria-invalid');
      }
    });

    // Проверяем встроенные HTML-ограничения формы.
    if (!form.checkValidity()) {
      formElements.forEach((element) => {
        if (element.willValidate && !element.checkValidity()) {
          element.setAttribute('aria-invalid', 'true');
        }
      });

      // Показываем стандартные сообщения браузера.
      form.reportValidity();
      return;
    }

    // Показываем сообщение об успешной отправке и прокручиваем к нему.
    successMessage.hidden = false;
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Очищаем форму.
    form.reset();

    // Дополнительное действие (например, закрыть модальное окно).
    if (onSuccess) {
      onSuccess();
    }
  });
}

// =========================================================
// Модальное окно быстрого заказа — есть только на главной.
// =========================================================
const orderDialog = document.getElementById('order-dialog');

if (orderDialog) {
  // Кнопки «Заказать» в карточках товаров.
  const orderButtons = document.querySelectorAll('.product-card__button[data-product]');

  // Кнопка закрытия модального окна.
  const closeDialogButton = document.getElementById('close-order-dialog');

  // Скрытое поле, в которое записывается выбранный товар.
  const selectedProductInput = document.getElementById('selected-product');

  // Заголовок окна — подставим в него название товара.
  const dialogTitle = document.getElementById('order-dialog-title');

  orderButtons.forEach((button) => {
    button.addEventListener('click', () => {
      // Получаем название товара из data-атрибута.
      const productName = button.dataset.product;

      // Записываем название товара в скрытое поле формы.
      selectedProductInput.value = productName;

      // Показываем, что именно заказывает пользователь.
      dialogTitle.textContent = 'Быстрый заказ: ' + productName;

      // Открываем модальное окно.
      orderDialog.showModal();
    });
  });

  // Закрываем модальное окно по кнопке «Закрыть».
  closeDialogButton.addEventListener('click', () => {
    orderDialog.close();
  });

  setupForm(
    document.getElementById('order-form'),
    document.getElementById('success-message'),
    () => orderDialog.close()
  );
}

// =========================================================
// Форма на странице предзаказа — есть только на order.html.
// =========================================================
const orderPageForm = document.getElementById('order-page-form');

if (orderPageForm) {
  setupForm(orderPageForm, document.getElementById('order-page-success'));
}
