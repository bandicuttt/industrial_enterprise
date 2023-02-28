// Execute code when the DOM content has been loaded
document.addEventListener('DOMContentLoaded', () => {
  const searchButton = document.querySelector('.btn.btn-primary');
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
    fetch('http://127.0.0.1:8000/api/profile/get_drivers/', {
      headers: {
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjc3NjE2NDgyLCJqdGkiOiI2YTkwNWE0M2M1ZGE0MjlmODg4NjhkNTM3ZWY2ZmVhYiIsInVzZXJfaWQiOjF9.uGqF50kZXyS6_TT8uadxavPSw5OC3TmBF8vFvHOWhcs`
      }
    })
    .then(response => response.json())
    .then(users => {
        // Filter user data based on search query and category
        const filteredUsers = users.filter(user => {
          if (searchCategory === 'ID') {
            return user.user.id.toString() === searchQuery;
          } else if (searchCategory === 'Имя Фамилия') {
            const fullName = `${user.user.first_name} ${user.user.last_name}`;
            return fullName.toLowerCase().includes(searchQuery.toLowerCase());
          } else if (searchCategory === 'Имя пользователя') {
            return user.user.username.toLowerCase().includes(searchQuery.toLowerCase());
          } else if (searchCategory === 'Email') {
            return user.user.email.toLowerCase().includes(searchQuery.toLowerCase());
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
          $('#error-message-search').text('Пользователь не найден!').css('color', 'red');
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
  
  
          // Populate the div element with relevant data
          div.innerHTML = `
              <div class="text-center card-box">
                  <div class="member-card pt-2 pb-2">
                      <div class="thumb-lg member-thumb mx-auto"><img src="https://bootdey.com/img/Content/avatar/avatar2.png" class="rounded-circle img-thumbnail" alt="profile-image"></div>
                      <div class="">
                          <h4>${user.user.first_name + ' ' + user.user.last_name}</h4>
                          <p class="text-muted">Email <span>| </span><span><a href="#" class="text-pink">${user.user.email}</a></span></p>
                          <p class="text-muted">Phone <span>| </span><span><a href="#" class="text-pink">${user.user.phone_number}</a></span></p>
                      </div>
                      <button type="button" class="btn btn-primary mt-3 btn-rounded waves-effect w-md waves-light" id=${user.user.id}">Профиль</button>
                      <div class="mt-4">
                          <div class="row">
                              <div class="col-4">
                                  <div class="mt-3">
                                      <h4>${user.category.title}</h4>
                                      <p class="mb-0 text-muted">Категория прав</p>
                                  </div>
                              </div>
                              <div class="col-4">
                                  <div class="mt-3">
                                      <h4>${user.user.user_dob}</h4>
                                      <p class="mb-0 text-muted">Дата рождения</p>
                                  </div>
                              </div>
                              <div class="col-4">
                                  <div class="mt-3">
                                      <h4>${user.user.id}</h4>
                                      <p class="mb-0 text-muted">ID пользователя</p>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          `;
  
          // Append the created div element to the parent element
          document.getElementById('user-container').appendChild(div);
        });
      });
  }});

  // Make API request with token
  fetch('http://127.0.0.1:8000/api/profile/get_drivers/', {
    headers: {
      'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjc3NjE2NDgyLCJqdGkiOiI2YTkwNWE0M2M1ZGE0MjlmODg4NjhkNTM3ZWY2ZmVhYiIsInVzZXJfaWQiOjF9.uGqF50kZXyS6_TT8uadxavPSw5OC3TmBF8vFvHOWhcs`
    }
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
      const dobCounts = {};

    // loop through the driver data and extract the DOB information
    data.forEach(driver => {
      const dob = new Date(driver.user.user_dob).toLocaleDateString();
      if (dob in dobCounts) {
        dobCounts[dob]++;
      } else {
        dobCounts[dob] = 1;
      }
    });

    // create an array of labels and counts for the graph
    const labels = Object.keys(dobCounts);
    const counts = Object.values(dobCounts);

    // create a bar chart using Chart.js library
    const ctx = document.getElementById('dob-chart').getContext('2d');
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Водители/Дата рождения',
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
        const div = document.createElement('div');
        div.setAttribute('class', 'col-lg-4');
        const count = document.querySelector('.count_drivers')
        count.setAttribute('placeholder', 'Найдено: '+data.length);
          
        // Populate the div element with relevant data
        div.innerHTML = `
            <div class="text-center card-box">
                <div class="member-card pt-2 pb-2">
                    <div class="thumb-lg member-thumb mx-auto"><img src="https://bootdey.com/img/Content/avatar/avatar2.png" class="rounded-circle img-thumbnail" alt="profile-image"></div>
                    <div class="">
                        <h4>${user.user.first_name + ' ' + user.user.last_name}</h4>
                        <p class="text-muted">Email <span>| </span><span><a href="#" class="text-pink">${user.user.email}</a></span></p>
                        <p class="text-muted">Phone <span>| </span><span><a href="#" class="text-pink">${user.user.phone_number}</a></span></p>
                    </div>
                    <button type="button" class="btn btn-primary mt-3 btn-rounded waves-effect w-md waves-light" id=${user.user.id}">Профиль</button>
                    <div class="mt-4">
                        <div class="row">
                            <div class="col-4">
                                <div class="mt-3">
                                    <h4>${user.category.title}</h4>
                                    <p class="mb-0 text-muted">Категория прав</p>
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="mt-3">
                                    <h4>${user.user.user_dob}</h4>
                                    <p class="mb-0 text-muted">Дата рождения</p>
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="mt-3">
                                    <h4>${user.user.id}</h4>
                                    <p class="mb-0 text-muted">ID пользователя</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Append the created div element to the parent element
        document.getElementById('user-container').appendChild(div);
      });
    })
    .catch(error => console.error(error));
    
});