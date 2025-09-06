export const userSalonData = {
  phone: "12345678",
  email: "salon@test.com",
  password: "12345678",
};

export const privateWorkerService = {
  name: "Super haircut",
  price: 30,
  duration: 25,
  availability: ["Sun", "Tue", "Sat"],
};

export const userCustomerData = {
  phone: "12345678",
  email: "customer@test.com",
  password: "12345678",
  fName: "Customer 1",
};

export const userPrivateWorkerData = {
  name: "Test Private Stylist",
  email: "privateWorker@test.com",
  tempPassword: 12345678,
  password: 978654321,
  service: privateWorkerService,
};

export const salonData = {
  noprivateWorkers: {
    name: "First Test Salon",
    owner: "test-owner",
    address: "1 test str.,",
    city: "Test-City",
    employees: 3,
    service: {
      name: "Haircut",
      price: 25,
      duration: 15,
      availability: ["Mon", "Wed", "Fri"],
    },
  },

  withPrivateWorkers: {
    name: "Second Test Salon",
    owner: "test-owner",
    address: "2 test str.,",
    city: "Test-City",
    employees: 2,
    privateWorker: userPrivateWorkerData,
  },

  salons: [
    {
      name: "Third Test Salon",
      owner: "test-owner",
      address: "3 test str.,",
      city: "Test-City",
      employees: 3,
      service: [
        {
          name: "Beard",
          price: 25,
          duration: 15,
          availability: ["Mon", "Wed", "Fri"],
        },
        {
          name: "Haircut",
          price: 35,
          duration: 25,
          availability: ["Mon", "Wed", "Fri"],
        },
      ],
    },
  ],
};
