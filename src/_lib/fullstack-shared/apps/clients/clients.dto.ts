import { IsEnum, IsInt, IsNotEmpty } from "class-validator";
import { ClientRequester } from "../../enums/microservices/clients.enum";



export class AddClientDto {
  @IsNotEmpty()
  @IsInt()
  user_id: number;
  
  @IsNotEmpty()
  @IsInt()
  authority_id: number;
}

export class AddClientRequestDto extends AddClientDto {
  @IsNotEmpty()
  @IsEnum(ClientRequester)
  requester: string;
}