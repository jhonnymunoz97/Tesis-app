export class User {
  // tslint:disable-next-line: variable-name
  id: number;
  dni: string;
  name: string;
  surname: string;
  email: string;
  verified: boolean;
  role: string;
  profilePhoto: string = 'https://i.pravatar.cc/1000';
  // tslint:disable-next-line: variable-name
  access_token?: any;
  // tslint:disable-next-line: variable-name
  last_login?: any;
}
