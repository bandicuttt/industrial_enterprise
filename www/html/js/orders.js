const token = localStorage.getItem('accessToken');

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
  } else {
    window.location.href = 'http://localhost/industrial_enterprise/www/html/auth.html';
  }
})
.catch(error => {
  console.error(error);
});


$.ajax({
  url: 'http://127.0.0.1:8000/api/profile/',
  type: 'GET',
  dataType: 'json',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  success: function(data) {
    try {
      if (data.role.title === 'Администратор') {
        
      } else {
        window.location.href = 'http://localhost/industrial_enterprise/www/html/profile_menu.html';
      };
    } catch (error) {

                    }
      },
  
  error: function(xhr, status, error) {
    console.log('Error: ' + error.message);
  }
});



// Execute code when the DOM content has been loaded
document.addEventListener('DOMContentLoaded', () => {
  const searchButton = document.querySelector('#search_drivers');
  const downloadButton = document.querySelector('#download_drivers');
  downloadButton.addEventListener('click', (event) => {
    event.preventDefault();
    function formatDate() {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const day = now.getDate();
      const hour = now.getHours();
      const minute = now.getMinutes();
      const formattedDate = `${day}:${month}:${year}-${hour}:${minute}`;
      return formattedDate;
    }

    function transformUser(input) {
      const output = {};
      
      output.id = input.id;
      output.outlet_id = input.outlet.id;
      output.outlet_photo = input.outlet.outlet_photo;
      output.outlet_phone = input.outlet.outlet_phone;
      output.outlet_name = input.outlet.outlet_name;
      output.outlet_address = input.outlet.outlet_address;
      output.customer_id = input.customer.id;
      output.customer_last_login = input.customer.last_login;
      output.customer_date_joined = input.customer.date_joined;
      output.customer_username = input.customer.username;
      output.customer_first_name = input.customer.first_name;
      output.customer_last_name = input.customer.last_name;
      output.customer_phone_number = input.customer.phone_number;
      output.customer_user_photo = input.customer.user_photo;
      output.customer_user_dob = input.customer.user_dob;
      output.customer_email = input.customer.email;
      output.customer_role_id = input.customer.role.id;
      output.customer_role_title = input.customer.role.title;
      output.product_id = input.product.id;
      output.product_name = input.product.product_name;
      output.product_price = input.product.product_price;
      output.unit_reg_num = input.unit.registration_number;
      output.delivery_price = input.unit.delivery_price;
      output.driver_id = input.driver.id;
      output.volume = input.volume;
      output.created_at = input.created_at;
      output.delivery_date = input.delivery_date;
      output.delivery_address = input.delivery_address;

      
      return output;
    }
    
    function downloadExcelFile(data) {
      const formattedDate = formatDate();
      const filename = `${formattedDate}.xlsx`;
      
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Drivers");
      XLSX.writeFile(workbook, filename);
    }
    
    fetch('http://127.0.0.1:8000/api/orders/', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
      .then(response => response.json())
      .then(data => {
        const transformedUsers = [];

        for (const user of data) {
          const transformedUser = transformUser(user);
          transformedUsers.push(transformedUser);
        }

        console.log(transformedUsers);
        downloadExcelFile(transformedUsers);
      })
      .catch(error => {
        console.error(error);
            });
        });
  searchButton.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent the form from submitting

    // Get search query and category from input fields
    const searchQuery = document.querySelector('input[type=search]').value;
    const searchCategory = document.querySelector('#Search_for_category').value;
    if (searchQuery == '' || searchCategory == 'Не выбрано') {
      $('#error-message-search').text('Заполните поля!').css('color', 'red');
            setTimeout(function() {
              $('#error-message-search').text('').css('color', '');
            }, 3000);
            return;
    } else {
      fetch('http://127.0.0.1:8000/api/orders/', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
    .then(response => response.json())
    .then(users => {
        // Filter user data based on search query and category
        const filteredUsers = users.filter(user => {
          if (searchCategory === 'ID') {
            return user.id.toString() === searchQuery;
          } else if (searchCategory === 'Все') {
            return true;
          } else {
            $('#error-message-search').text('Категория поиска не выбрана!').css('color', 'red');
            setTimeout(function() {
              $('#error-message-search').text('').css('color', '');
            }, 3000);
            return;
          }
        }); // Add closing parenthesis here
        if (filteredUsers.length === 0 && searchCategory != 'Не выбрано') {
          $('#error-message-search').text('Товар не найден!').css('color', 'red');
            setTimeout(function() {
              $('#error-message-search').text('').css('color', '');
            }, 3000);
            return;
        }
        const cols = document.querySelectorAll('.col-lg-4');
        cols.forEach(col => {
          col.style.display = 'none';
        });
        
        filteredUsers.forEach(user => {
          const div = document.createElement('div');
          div.setAttribute('class', 'col-lg-4');
          const count = document.querySelector('.count_drivers')
          count.setAttribute('placeholder', 'Найдено: '+filteredUsers.length);
          if (user.product_photo == null) {
            var user_photo = 'media/product.png'
          } else {
            var user_photo = '../../media/media/' + user.product_photo.split('/').pop();
          };
          if (user.delivery_date == null) {
            var status = 'В пути 🕔'
          } else {
            var status = user.delivery_date
          }
  
          // Populate the div element with relevant data
          div.innerHTML = `
            <div class="text-center card-box">
                <div class="member-card pt-2 pb-2">
                    <div class="thumb-lg member-thumb mx-auto"><img src="${user_photo}" class="rounded-circle img-thumbnail" alt="profile-image"></div>
                    <div class="">
                        <h4>ID: ${user.id}</h4>
                        <p class="text-muted">Товар: <span>| </span><span><a href="#" class="text-pink">${user.product.product_name}</a></span></p>
                        <p class="text-muted">Количество <span>| </span><span><a href="#" class="text-pink">${user.volume}</a></span></p>
                        <p class="text-muted">Создан <span>| </span><span><a href="#" class="text-pink">${user.created_at}</a></span></p>
                        <p class="text-muted">Доставлен <span>| </span><span><a href="#" class="text-pink">${status}</a></span></p>
                        <p class="text-muted">Адрес доставки <span>| </span><span><a href="#" class="text-pink">${user.delivery_address}</a></span></p>
                        <p class="text-muted">Контактный телефон <span>| </span><span><a href="#" class="text-pink">${user.customer.phone_number}</a></span></p>
                        <p class="text-muted">Курьер <span>| </span><span><a href="#" class="text-pink">${user.driver.user.first_name + ' ' + user.driver.user.last_name}</a></span></p>
                        <p class="text-muted">Вес <span>| </span><span><a href="#" class="text-pink">${user.volume * user.product.weight} кг</a></span></p>
                        <p class="text-muted">Стоимость <span>| </span><span><a href="#" class="text-pink">${Number(user.volume) * Number(user.product.product_price) + Number(user.unit.delivery_price)} $</a></span></p>
                    </div>
                </div>
            </div>
        `;
  
          // Append the created div element to the parent element
          document.getElementById('user-container').appendChild(div);
          const driverButtons = document.querySelectorAll('.btn.btn-primary.mt-3.btn-rounded.waves-effect.w-md.waves-light');
      driverButtons.forEach(button => {
        button.addEventListener('click', (event) => {
          event.preventDefault();
          const ProfileId = event.target.id;
          console.log(ProfileId)
          window.location.href = 'http://localhost/industrial_enterprise/www/html/profile_view.html?id='+ProfileId;
        });
      });
        });
      });
  }});

  // Make API request with token
  fetch('http://127.0.0.1:8000/api/orders/', {
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

    // create an array of labels and counts for the graph
    const labels = Object.keys(productCounts);
    const counts = Object.values(productCounts);

    // create a bar chart using Chart.js library
    const ctx = document.getElementById('dob-chart').getContext('2d');
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Товар/Количество',
          data: counts,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
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
        count.setAttribute('placeholder', 'Найдено: '+data.length);
          
        // Populate the div element with relevant data
        if (user.product_photo == null) {
          var user_photo = 'media/product.png'
        } else {
          var user_photo = '../../media/media/' + user.product_photo.split('/').pop();
        };
        if (user.delivery_date == null) {
          var status = 'В пути 🕔'
        } else {
          var status = user.delivery_date
        }
        div.innerHTML = `
            <div class="text-center card-box">
                <div class="member-card pt-2 pb-2">
                    <div class="thumb-lg member-thumb mx-auto"><img src="${user_photo}" class="rounded-circle img-thumbnail" alt="profile-image"></div>
                    <div class="">
                        <h4>ID: ${user.id}</h4>
                        <p class="text-muted">Товар: <span>| </span><span><a href="#" class="text-pink">${user.product.product_name}</a></span></p>
                        <p class="text-muted">Количество <span>| </span><span><a href="#" class="text-pink">${user.volume}</a></span></p>
                        <p class="text-muted">Создан <span>| </span><span><a href="#" class="text-pink">${user.created_at}</a></span></p>
                        <p class="text-muted">Доставлен <span>| </span><span><a href="#" class="text-pink">${status}</a></span></p>
                        <p class="text-muted">Адрес доставки <span>| </span><span><a href="#" class="text-pink">${user.delivery_address}</a></span></p>
                        <p class="text-muted">Контактный телефон <span>| </span><span><a href="#" class="text-pink">${user.customer.phone_number}</a></span></p>
                        <p class="text-muted">Курьер <span>| </span><span><a href="#" class="text-pink">${user.driver.user.first_name + ' ' + user.driver.user.last_name}</a></span></p>
                        <p class="text-muted">Вес <span>| </span><span><a href="#" class="text-pink">${user.volume * user.product.weight} кг</a></span></p>
                        <p class="text-muted">Стоимость <span>| </span><span><a href="#" class="text-pink">${Number(user.volume) * Number(user.product.product_price) + Number(user.unit.delivery_price)} $</a></span></p>
                    </div>
                </div>
            </div>
        `;

        // Append the created div element to the parent element
        document.getElementById('user-container').appendChild(div);
        
        });
      var graphsButton = document.getElementById('graphs');
      const driverButtons = document.querySelectorAll('.btn.btn-primary.mt-3.btn-rounded.waves-effect.w-md.waves-light');
      driverButtons.forEach(button => {
        button.addEventListener('click', (event) => {
          event.preventDefault();
          const ProfileId = event.target.id;
          if (ProfileId === 'graphs') {
            dobChart.scrollIntoView({ behavior: 'smooth' });
          } else {
          window.location.href = 'http://localhost/industrial_enterprise/www/html/profile_view.html?id='+ProfileId;
        }
        });
      });
          })
    .catch(error => console.error(error));
    
});