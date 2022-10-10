export interface CreateUserRequestDTO {
    name: string,
    email: string,
    password: string,
    permissions: string
}

export interface CreateUserResponseDTO {
    id: string,
    name: string,
    email: string
}