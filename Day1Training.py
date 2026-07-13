


class Bank:

    def __init__(self, id, name, customers=None):
        self.id = id
        self.name = name
        self.customers = customers if customers is not None else []

    # Getters
    def get_id(self):
        return self.id

    def get_name(self):
        return self.name

    def get_customers(self):
        return self.customers

    # Setters
    def set_id(self, id):
        self.id = id

    def set_name(self, name):
        self.name = name

    def set_customers(self, customers):
        self.customers = customers


class Customer:
    def __init__(self, id, name, password, isAdmin = False, accounts=None):
        self.id = id
        self.name = name
        self.password = password
        self.accounts = accounts if accounts is not None else []

# class Admin(Customer):
#     def __init__(self, id, name, password, accounts=None):
#         super().__init__(id, name, password, accounts)
#         self.is_admin = True

class Accounts:
    def __init__(self, id, account_type, balance):
        self.id = id
        self.account_type = account_type
        self.balance = balance

def seed_users():
    users = {}

    users["admin"] = Customer(1, "admin", "admin", True)
    users["admin2"] = Customer(2, "admin2", "admin2" ,  True)
    users["john"] = Customer(3, "John", "pass")
    users["alice"] = Customer(4, "Alice", "pass")

    return users

def main():
    print("Welcome to the Bank")

    users = seed_users()

    username = None
    password = None

    isAdmin = False
    
    while True:
        username = input("Please enter your user name: ")
        password = input("Please enter your password: ")

        if username not in users or password != users[username].password:
            print("Not a user!")
        else:
            isAdmin = users[username]
            break

    print("seccessful log in")

if __name__ == "__main__":
    main()