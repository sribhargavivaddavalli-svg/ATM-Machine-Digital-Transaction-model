package DSA;
import java.util.*;

class Account {
    String bank;
    int pin;
    double balance;
    Stack<String> history;

    Account(String bank, int pin, double balance) {
        this.bank = bank;
        this.pin = pin;
        this.balance = balance;
        history = new Stack<>();
    }
}

public class ATMSystem {

    static Scanner sc = new Scanner(System.in);
    static ArrayList<Account> accounts = new ArrayList<>();
    static Account current = null;

    public static void main(String[] args) {

        accounts.add(new Account("SBI Bank", 4829, 10000));
        accounts.add(new Account("HDFC Bank", 9173, 15000));
        accounts.add(new Account("ICICI Bank", 3508, 20000));
        accounts.add(new Account("Axis Bank", 7641, 25000));
        accounts.add(new Account("PNB Bank", 5294, 12000));

        login();

        while (true) {
            System.out.println("\n===== ATM MENU =====");
            System.out.println("1. Check Balance");
            System.out.println("2. Deposit");
            System.out.println("3. Withdraw");
            System.out.println("4. Transfer");
            System.out.println("5. Full History");
            System.out.println("6. Last 5 Transactions");
            System.out.println("7. Exit");

            System.out.print("Choose option: ");
            int choice = sc.nextInt();

            switch (choice) {

                case 1:
                    checkBalance();
                    break;

                case 2:
                    deposit();
                    break;

                case 3:
                    withdraw();
                    break;

                case 4:
                    transfer();
                    break;

                case 5:
                    fullHistory();
                    break;

                case 6:
                    lastFive();
                    break;

                case 7:
                    System.out.println("Thank you for using ATM!");
                    System.exit(0);

                default:
                    System.out.println("Invalid option!");
            }
        }
    }

    static void login() {
        System.out.println("===== ATM LOGIN =====");
        System.out.print("Enter PIN: ");
        int pin = sc.nextInt();

        for (Account acc : accounts) {
            if (acc.pin == pin) {
                current = acc;
                System.out.println("Welcome to " + acc.bank);
                return;
            }
        }

        System.out.println("Invalid PIN!");
        login();
    }

    static void checkBalance() {
        System.out.println("Current Balance: ₹" + current.balance);
    }

    static void deposit() {
        System.out.print("Enter amount: ");
        double amt = sc.nextDouble();

        if (amt > 0) {
            current.balance += amt;
            current.history.push("Deposit ₹" + amt);
            System.out.println("Deposit successful!");
        }
    }

    static void withdraw() {
        System.out.print("Enter amount: ");
        double amt = sc.nextDouble();

        if (amt > 0 && amt <= current.balance) {
            current.balance -= amt;
            current.history.push("Withdraw ₹" + amt);
            System.out.println("Withdrawal successful!");
        } else {
            System.out.println("Insufficient balance!");
        }
    }

    static void transfer() {
        System.out.print("Enter receiver PIN: ");
        int pin = sc.nextInt();

        System.out.print("Enter amount: ");
        double amt = sc.nextDouble();

        for (Account acc : accounts) {
            if (acc.pin == pin) {

                if (amt <= current.balance) {
                    current.balance -= amt;
                    acc.balance += amt;

                    current.history.push("Transfer ₹" + amt + " to " + acc.bank);

                    System.out.println("Transfer successful!");
                    return;
                }
            }
        }

        System.out.println("Transfer failed!");
    }

    static void fullHistory() {
        System.out.println("\nTransaction History:");

        if (current.history.isEmpty()) {
            System.out.println("No transactions found.");
            return;
        }

        for (String h : current.history) {
            System.out.println(h);
        }
    }

    static void lastFive() {
        System.out.println("\nLast 5 Transactions:");

        int count = 0;

        for (int i = current.history.size() - 1; i >= 0 && count < 5; i--) {
            System.out.println(current.history.get(i));
            count++;
        }
    }
}