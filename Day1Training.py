import os


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


class User:
    def __init__(self, id, username, password):
        self.id = id
        self.username = username
        self.password = password

    def get_user_type(self):
        raise NotImplementedError

class Admin(User):
    def get_user_type(self):
        return "admin"

class Customer(User):
    def __init__(self, id, username, password, accounts=None):
        super().__init__(id, username, password)
        self.accounts = accounts if accounts is not None else []

    def get_user_type(self):
        return "customer"

class Account:
    def __init__(self, id, balance=0):
        self.id = id
        self.balance = balance

    def get_id(self):
        return self.id

    def get_balance(self):
        return self.balance
    
    def deposit(self, amount):
        self.balance += amount

    def withdraw(self, amount):
        if amount > self.balance:
            print("Insufficient funds")
            return False
        self.balance -= amount
        return True

    def transfer(self, other_account, amount):
        if self.withdraw(amount):
            other_account.deposit(amount)
            return True
        return False

    def get_interest_rate(self):
        raise NotImplementedError
    def get_account_type(self):
        raise NotImplementedError

    
class CheckingAccount(Account):
    def get_interest_rate(self):
        return 0.01
    def get_account_type(self):
        return "Checking"

class SavingsAccount(Account):
    def get_interest_rate(self):
        return 0.02
    def get_account_type(self):
        return "Savings"

def seed_users():
    users = {}

    users["admin"] = Admin(1, "admin", "admin")
    users["admin2"] = Admin(2, "admin2", "admin2")

    users["john"] = Customer(3, "John", "pass", accounts=[
        CheckingAccount(id=1, balance=500),
        CheckingAccount(id=2, balance=700),
        SavingsAccount(id=3, balance=2000)
    ])
    users["alice"] = Customer(4, "Alice", "pass", accounts=[
        SavingsAccount(id=2, balance=1000)
    ])

    return users

def login(users):
    username = input("Please enter your username: ")
    password = input("Please enter your password: ")
    user = users.get(username)
    if user and user.password == password:
        return user
    return None

def customer_dashboard(user):

    while True:

        os.system("clear")
        print("1) View accounts  2) Deposit  3) Withdraw  4) Transfer  5) Logout")

        choice = input("Choose an option: ")

        if choice == "1":

            os.system("clear")
            for acc in user.accounts:
                print("Account ", acc.get_id(), " ", acc.get_account_type(), " Balance:", acc.get_balance())

            x = input("Hit enter to go back to the main menu")

        if choice == "2":

            os.system("clear")
            print("Select an account number")

            for i, acc in enumerate(user.accounts, start=1):
                print("Account number: " , i , " | ", acc.get_account_type(), " | Balance:", acc.get_balance())
            
            selection = int(input())

            acc = user.accounts[selection-1]

            os.system("clear")
            deposit = int(input("How much would you like to deposit: "))

            acc.deposit(deposit)

            os.system("clear")
            print("succesfully deposited " , deposit , " hit enter to go back to the main menu")
            input()

        if choice == "3":

            os.system("clear")
            print("Select an account number")

            for i, acc in enumerate(user.accounts, start=1):
                print("Account number: " , i , " | ", acc.get_account_type(), " | Balance:", acc.get_balance())
            
            selection = int(input())

            acc = user.accounts[selection-1]

            os.system("clear")
            withdraw = int(input("How much would you like to withdraw: "))

            acc.withdraw(withdraw)
            
            os.system("clear")
            print("succesfully withdrew " , withdraw , " hit enter to go back to the main menu")
            input()

        if choice == "4":
            os.system("clear")
            print("select which account to withdaw from: ")

            for i, acc in enumerate(user.accounts, start=1):
                print("Account number: " , i , " | ", acc.get_account_type(), " | Balance:", acc.get_balance())
            
            withdraw_account = user.accounts[ int(input())-1]

            os.system("clear")
            print("select which account to deposit to: ")

            for i, acc in enumerate(user.accounts, start=1):
                print("Account number: " , i , " | ", acc.get_account_type(), " | Balance:", acc.get_balance())\
                
            deposite_account = user.accounts[ int(input())-1]
            
            os.system("clear")
            money = input("How much would you like to transfer")

            withdraw_account.transfer(deposite_account, int(money))

            os.system("clear")
            print("succesfully transfered " , money , " hit enter to go back to the main menu")
            input()
        else:
            print("logging out")
            break





def admin_dashboard(bank, users):
    x = 0

def main():
    print("Welcome to the Bank")

    users = seed_users()

    bank = Bank(1, "ABC Digital Bank", [u for u in users.values() if u.get_user_type() == "customer"] )
    
    while True:
        user = login(users)
        if user is None:
            print("Invalid Credentials")
        elif user.get_user_type() == "admin":
            admin_dashboard(bank, users)
        else:
            customer_dashboard(user)
        
        if input("Attempt another log in? y/n: ").lower() == "n":
            break
if __name__ == "__main__":
    main()