export interface AuthUserRequestDTO {
    email: string,
    password: string
}

export interface AuthUserResponseDTO {
    token: string
}