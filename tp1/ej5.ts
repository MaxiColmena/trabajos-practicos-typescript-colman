class Persona {
    private readonly dni: number;
    public nombre: string;
    
    // Le ponemos guión bajo a los privados para que no choquen con el get/set
    private _edad: number = 0;
    private _email: string = "";

    constructor(dni: number, nombre: string) {
        this.dni = dni;
        this.nombre = nombre;
    }

    // edad
    get edad(): number {
        return this._edad;
    }

    set edad(valor: number) {
        if(valor < 0 || valor > 120 ){
            throw new Error("La edad es inválida")
        } else {
            this._edad = valor
        }
    }

    // email
    get email(): string {
        return this._email;
    }

    set email(valor: string) {
        if(!valor.includes("@")){
            throw new Error("El email debe contener un @")
        } else {
            this._email = valor
        }
    }

    // mayor de edad
    get esMayorDeEdad(): boolean{
        return this.edad >= 18;
    }

    //datos
    get datosPublicos(): string{
        return `Nombre: ${this.nombre}, ¿Es mayor?: ${this.esMayorDeEdad}`
    }
}

// Ponemos a prueba la función pasándole nuestra persona
const persona = new Persona(45050623, "Maxi Colman");
persona.edad = 22;
persona.email = "maxi@example.com";

// Leemos con los getters (no se expone el dni privado)
console.log(`Edad: ${persona.edad}`);
console.log(`Email: ${persona.email}`);
console.log(`¿Es mayor de edad?: ${persona.esMayorDeEdad}`);
console.log(persona.datosPublicos);

// Probamos que los setters validen los datos
try {
    persona.edad = 150;
} catch (error) {
    console.log(`Error: ${(error as Error).message}`);
}

try {
    persona.email = "correo-sin-arroba";
} catch (error) {
    console.log(`Error: ${(error as Error).message}`);
}

// Los valores anteriores no cambiaron
console.log(`Edad: ${persona.edad}, Email: ${persona.email}`);