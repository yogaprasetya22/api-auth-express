import { User } from "@prisma/client"; // Sesuaikan dengan lokasi model User

declare global {
    namespace Express {
        interface Request {
            user?: User; // Tambahkan properti user dengan tipe User dari Prisma
        }
    }
}
