class User {
    id: string;
    name: String; 
    email: String; 
    description: String;
    password: String; 
    image: String | null

    constructor(id: string, name: String, email: String, password: string, description: String, image: String | null) {
      this.id = id;
      this.name = name;
      this.email = email;
      this.description = description;
      this.password = password
      this.image = image;
    }
  }
export default User