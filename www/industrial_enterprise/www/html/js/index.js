

// Retrieve token from localStorage
const token = localStorage.getItem('accessToken');

async function createOrder(customer_id, delivery_address, product_id, volume) {
  const url = 'http://127.0.0.1:8000/api/order/create_order/'+customer_id+'/'+product_id+'/'+volume+'/'+delivery_address+'/';
  const body = {
    customer_id: customer_id,
    delivery_address: delivery_address,
    product_id: product_id,
    volume: volume,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
      body: JSON.stringify(body), 
    });

    if (response.status === 201) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error creating order:', error);
    return false;
  }
}
// Verify token using API endpoint
fetch('http://127.0.0.1:8000/api/auth/jwt/verify/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ token: token })
})
.then(response => {
  if (response.status === 200) {
    // token is valid, continue with application logic
  } else {
    // token is invalid, redirect to login page
    window.location.href = 'http://localhost/industrial_enterprise/www/html/auth.html';
  }
})
.catch(error => {
  // handle fetch errors
  console.error(error);
});


$(document).ready(function() {
  $.ajax({
    url: 'http://127.0.0.1:8000/api/profile/',
    type: 'GET',
    dataType: 'json',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    success: function(data) {
      localStorage.setItem('user_id', data.id);
      try {
        if (data.role.title === 'Администратор') {
          $('#user_nav_bar').css('display', 'none');
          $('#admin_nav_bar').css('display', 'block');
        };
      } catch (error) {
        $('#driver_initial_info').css('display', 'block');}
        },
    error: function(xhr, status, error) {
      console.log('Error: ' + error.message);
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  // Make API request with token
  fetch('http://127.0.0.1:8000/api/products/', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  })
  .then(response => {
    if (response.status === 200) {
      console.log('Норм');
      
    } else {
      console.log('Пиздец');
    }
    return response.json();
  })
    .then(data => {
      const productCounts = {};

    // loop through the driver data and extract the DOB information
    data.forEach(product => {
      const volume = product.volume;
      const productName = product.product_name;
      if (productName in productCounts) {
        productCounts[productName] += volume;
      } else {
        productCounts[productName] = volume;
      }
    });

      // Convert API response to a JavaScript object
      const users = data;

      // Loop through the data and create a div element for each item
      users.forEach(user => {
        console.log(user.product_photo)
        const div = document.createElement('div');
        div.setAttribute('class', 'col-lg-4');
        const count = document.querySelector('.count_drivers')
          
        // Populate the div element with relevant data
        if (user.product_photo == null) {
          var user_photo = 'media/product.png'
        } else {
          var user_photo = '../../media/media/' + user.product_photo.split('/').pop();
        };
        div.innerHTML = `
            <div class="text-center card-box">
                <div class="member-card pt-2 pb-2">
                    <div class="thumb-lg member-thumb mx-auto"><img src="${user_photo}" class="rounded-circle img-thumbnail" alt="profile-image"></div>
                    <div class="">
                        <h4>${user.product_name}</h4>
                        <p class="text-muted">Количество <span>| </span><span><a href="#" class="text-pink">${user.volume}</a></span></p>
                        <p class="text-muted">Вес <span>| </span><span><a href="#" class="text-pink">${user.weight}</a></span></p>
                        <p class="text-muted">Цена <span>| </span><span><a href="#" class="text-pink">${user.product_price} $</a></span></p>
                        <button type="button" class="btn btn-primary" name='${user.product_price}' id='${user.id}' data-toggle="modal" data-target="#myModal">
                        Заказать
                      </button>
                    </div>
                </div>
            </div>
            <div class="modal fade" id="myModal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
        
          <!-- Modal Header -->
          <div class="modal-header">
            <h4 class="modal-title">Меню оформления заказа</h4>
            <button type="button" class="close" data-dismiss="modal">×</button>
          </div>
          
          <!-- Modal body -->
          <div class="modal-body">
              <div class='block'>
            <h5>📦 Количество товара</h5>
            <input type="number" name="volume_count" id="quantityInput" placeholder="5" min="0" max="100" oninput="validity.valid||(value='');">
            <h5>🚚 Адрес доставки</h5>
            <input type="text" name="delivery_address" placeholder="ул. Крылатова, 39"><br><br>

              </div>
          </div>
          
          <!-- Modal footer -->
          <div class="modal-footer">
            <button type="button" name='${user.product_price}' id='${user.id}' class="btn btn-secondary" data-dismiss="modal">Оформить заказ</button>
            <button type="button" class="btn btn-firstly" data-dismiss="modal">Закрыть</button>
          </div>
          
        </div>
      </div>
    </div>
        `;

        // Append the created div element to the parent element
        document.getElementById('user-container').appendChild(div);
        
        });
        const createOrderBtn = document.querySelector('.btn.btn-secondary');
createOrderBtn.addEventListener('click', (event) => {
  const volumeInput = document.getElementById('quantityInput');
  const deliveryInput = document.querySelector('input[name="delivery_address"]');
  
  // Validate the volume input
  const volume = parseInt(volumeInput.value);
  if (isNaN(volume) || volume < 0 || volume > 100) {
    alert('Значение не может быть больше 100 или меньше 0');
    return;
  }
  
  // Validate the delivery address input
  const delivery_address = deliveryInput.value.trim();
  if (delivery_address.length < 3) {
    alert('Адрес заполнен неверно, пожалуйста, введите корректный адрес доставки.');
    return;
  }

  // Get the product ID and price from the button attributes
  const productId = event.target.id;
  const productPrice = event.target.name;
  const customer_id = localStorage.getItem('user_id');

  // Call the createOrder function with the required parameters
  createOrder(customer_id, delivery_address, productId, volume)
    .then((result) => {
      if (result) {
        window.location.href = 'http://localhost/industrial_enterprise/www/html/success_order.html';
      } else {
        window.location.href = 'http://localhost/industrial_enterprise/www/html/error.html';
        console.log('Failed to create order');
      }
    })
    .catch((error) => {
      window.location.href = 'http://localhost/industrial_enterprise/www/html/error.html';
      console.error('Error creating order:', error);
    });
});
          })
    .catch(error => console.error(error));
    
});
