interface User {
  username: string;
  email: string;
}

// Codigo original (una sola clase con muchas responsabilidades):
// class UserManager {
//   users: User[] = [];
//
//   register(username: string, email: string): string {
//     if (!email.includes("@")) {
//       throw new Error("El correo no es valido");
//     }
//
//     this.users.push({ username, email });
//     return this.sendWelcomeEmail(email);
//   }
//
//   private sendWelcomeEmail(email: string): string {
//     return `Email enviado a ${email}`;
//   }
// }

// Responsabilidad 1: validar los datos
class UserValidator {
  validateEmail(email: string): void {
    if (!email.includes("@")) {
      throw new Error("El correo no es valido");
    }
  }
}

// Responsabilidad 2: guardar los usuarios
class UserRepository {
  private users: User[] = [];

  save(user: User): void {
    this.users.push(user);
  }

  findAll(): User[] {
    return [...this.users];
  }
}

// Responsabilidad 3: enviar correos
class EmailService {
  sendWelcomeEmail(email: string): string {
    return `Email enviado a ${email}`;
  }
}

// Coordina el registro usando composicion: no valida, no guarda ni envia por si mismo
class UserRegistrationService {
  private readonly validator: UserValidator;
  private readonly repository: UserRepository;
  private readonly emailService: EmailService;

  constructor(validator: UserValidator, repository: UserRepository, emailService: EmailService) {
    this.validator = validator;
    this.repository = repository;
    this.emailService = emailService;
  }

  register(username: string, email: string): string {
    this.validator.validateEmail(email);
    this.repository.save({ username, email });
    return this.emailService.sendWelcomeEmail(email);
  }
}

const repository = new UserRepository();
const registrationService = new UserRegistrationService(
  new UserValidator(),
  repository,
  new EmailService()
);

console.log(registrationService.register("maxi", "maxi@example.com"));
console.log(repository.findAll());

try {
  registrationService.register("sinmail", "correo-invalido");
} catch (error) {
  console.log("Error:", (error as Error).message);
}

// Preguntas:
// - Que responsabilidades tiene `UserManager`?
//   Coordinar el registro, validar el email, guardar los usuarios y enviar el correo de bienvenida.
//   Son cuatro motivos distintos para cambiar la misma clase.
//
// - Que ocurre si cambia la forma de guardar datos?
//   Habria que modificar UserManager, y al tocarla se corre el riesgo de romper la validacion
//   o el envio de correos. Con la separacion solo se cambia UserRepository.
//
// - Que clase podria encargarse de enviar correos?
//   EmailService, una clase dedicada solo al envio de correos.
