
import { z } from "zod";

// Validation schema for login form
export const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

// Validation schema for XML upload
export const xmlUploadSchema = z.object({
  file: z.instanceof(File)
    .refine(file => file.size <= 10 * 1024 * 1024, "File size must be less than 10MB")
    .refine(
      file => file.type === "text/xml" || file.name.endsWith(".xml"), 
      "File must be an XML document"
    )
});

// Schema for brazilian XML
export const brazilianXmlSchema = z.object({
  PrescricaoRacao: z.object({
    Produto: z.object({
      Nome: z.string().min(1, "Nome do produto é obrigatório"),
      Tipo: z.string().optional(),
      Peso: z.string().optional(),
      DataFabricacao: z.string().optional(),
      Validade: z.string().optional(),
      CodigoLote: z.string().optional()
    }),
    Fabricante: z.object({
      RazaoSocial: z.string().min(1, "Razão social é obrigatória"),
      CNPJ: z.string().optional(),
      Endereco: z.string().optional()
    }),
    Composicao: z.object({
      Ingrediente: z.array(z.object({
        Nome: z.string(),
        Quantidade: z.string()
      }))
    }),
    Garantias: z.object({
      Garantia: z.array(z.object({
        Nome: z.string(),
        Minimo: z.string().optional(),
        Maximo: z.string().optional()
      }))
    }),
    ModoDeUso: z.string().optional()
  })
});

// Schema for user creation
export const userSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "operator"])
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

// Helper function to validate data against a schema
export const validateData = <T>(
  schema: z.ZodType<T>,
  data: unknown
): { success: boolean; data?: T; errors?: Record<string, string> } => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Convert ZodError to a more friendly format
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        if (err.path.length > 0) {
          errors[err.path.join(".")] = err.message;
        } else {
          errors["_form"] = err.message;
        }
      });
      return { success: false, errors };
    }
    
    // Unknown error
    return { 
      success: false, 
      errors: { "_form": "Unknown validation error occurred" } 
    };
  }
};
