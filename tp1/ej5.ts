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
const persona = new Persona( 45050623,"Maxi Colman" );
persona.edad = 22
persona.email = "maximojcolman02@gmail.com"

console.log(persona)

persona.esMayorDeEdad
//"maximojcolman02@gmail.com"