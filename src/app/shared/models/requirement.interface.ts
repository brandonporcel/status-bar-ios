export interface EntityRequirement {
  id: number;
  idRole: number;
  description: string;
  requirements: Requirement[];
}

export interface Requirement {
  id: number;
  description: string;
  code: string;
  requiresBothSides: boolean;
}
