export interface Service {
  name: string;
  price: number;
  estimatedDuration: number;
  availability: string[];
  privateWorkerId?: string;
  id: string;
}

export interface PublicService extends Service {}

export interface ServiceSchema extends Service {}
