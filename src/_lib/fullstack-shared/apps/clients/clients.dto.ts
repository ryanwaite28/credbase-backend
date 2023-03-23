import { IsInt, IsNotEmpty } from "class-validator";



export class AddClientDto {
  @IsNotEmpty()
  @IsInt()
  user_id: number;
  
  @IsNotEmpty()
  @IsInt()
  authority_id: number;
}