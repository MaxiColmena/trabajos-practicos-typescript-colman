interface User {
  username: string;
  email: string;
}

class UserValidator{
  isValid(email: string): boolean {
    if (!email.includes("@")) {
      throw new Error("El correo no es valido");
    } 
    return true;
  }
}

class UserRepository {
  users: User[] = [];
  save( username: string, email: string ): void {
    this.users.push({username, email})
  }
}

class EmailService {
    private sendWelcomeEmail(email: string): string {
    return `Email enviado a ${email}`;
   }
}

class UserRegistrationService {

}



// class UserManager {
//   users: User[] = [];

//   register(username: string, email: string): string {
//     if (!email.includes("@")) {
//       throw new Error("El correo no es valido");
//     }

//     this.users.push({ username, email });
//     return this.sendWelcomeEmail(email);
//   }

//   private sendWelcomeEmail(email: string): string {
//     return `Email enviado a ${email}`;
//   }
// }
