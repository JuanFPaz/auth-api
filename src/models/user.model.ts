import type { UserConstructor, UserResponse } from "../types/user.types";

export class User {
  private _id: string;
  private _username: string;
  private _name:string;
  private _lastname:string;
  private _email:string;
  private _birthday: Date
  private _country:string;
  private _createdAt: Date;
  private _lastSession: Date;

  constructor(u: UserConstructor) {
    this._id = u.id;
    this._username = u.username;
    this._name = u.name;
    this._lastname = u.lastname;
    this._email = u.email;
    this._birthday = u.birthday
    this._country = u.country;
    this._createdAt = u.createdAt;
    this._lastSession = new Date(Date.now());
  }

  public get id(): string {
    return this._id;
  }

  public get username(): string {
    return this._username;
  }

  public get name():string{
    return this._name
  }

  public get lastname():string{
    return this._lastname
  }

  public get email():string{
    return this._email
  }

  public get country():string{
    return this._country
  }

  public get birthday(): string {
    const bd: Date = this._birthday as Date; // OUTPUT: 2005-02-01T03:00:00.000Z como Date
    const ISOSformat = bd.toISOString(); // Convertimos a bd en string, con el mismo formato que arriba.
    const ISOSsplit = ISOSformat.split("T"); // OUTPUT: [ '2005-02-01', '03:00:00.000Z' ] - Convertimos a ISOSformat en un arreglo con la fecha y el horario.
    const getBirthday = ISOSsplit[0].split("-").reverse().join("/"); // Agarramos el primer elemento de ISOSsplit, invertimos el formato de fecha de YYYY-MM-DD a DD/MM/YYYY

    return getBirthday
  }

  public get lastSession(): string {
    const ls: Date = this._lastSession; // OUTPUT: 2005-02-01T03:00:00.000Z como Date

    const ISOSformat = ls.toISOString();
    const ISOSsplit = ISOSformat.split("T");
    const getDate = ISOSsplit[0].split("-").reverse().join("/");
    const hour = ls.getHours().toString().padStart(2, "0");
    const minutes = ls.getMinutes().toString().padStart(2, "0");
    const seconds = ls.getSeconds().toString().padStart(2, "0");

    return `${getDate} ${hour}:${minutes}:${seconds}`;
  }

  public get createdAt(): string {
    const cat: Date = this._createdAt; // OUTPUT: 2005-02-01T03:00:00.000Z como Date

    const ISOSformat = cat.toISOString();
    const ISOSsplit = ISOSformat.split("T");
    const getDate = ISOSsplit[0].split("-").reverse().join("/");
    const hour = cat.getHours().toString().padStart(2, "0");
    const minutes = cat.getMinutes().toString().padStart(2, "0");
    const seconds = cat.getSeconds().toString().padStart(2, "0");

    return `${getDate} ${hour}:${minutes}:${seconds}`;
  }

  public toObject():UserResponse{
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      name: this.name,
      lastname: this.lastname,
      birthday: this.birthday,
      country: this.country,
      createdAt: this.createdAt,
      lastSession: this.lastSession
    }
  }
}

