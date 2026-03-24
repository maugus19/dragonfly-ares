import { Stack, TextField, Button } from "@mui/material";
import { useState } from "react";

type UrlItem = {
  url: string;
  server: string;
};

export function CodeForm() {
  const [urls, setUrls] = useState<UrlItem[]>([
    { url: "", server: "" }
  ]);

  const addUrl = () => {
    setUrls([...urls, { url: "", server: "" }]);
  };

  const removeUrl = (index: number) => {
    setUrls(urls.filter((_, i) => i !== index));
  };

  const handleChange = (
    index: number,
    field: keyof UrlItem,
    value: string
  ) => {
    const updated = [...urls];
    updated[index][field] = value;
    setUrls(updated);
  };

  return (
<form
  onSubmit={(e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data = {
      title: formData.get("title"),
      code: formData.get("code"),
      image_url: formData.get("image_url"),
      url: urls, // 👈 ojo: usa "urls" (plural)
    };

    fetch("/api/codes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(async (res) => {
        if (!res.ok) {
          const error = await res.text();
          throw new Error(error || "Error en la API");
        }

        return res.json(); // opcional
      })
      .then(() => {
        window.alert("Código creado correctamente");
        e.currentTarget.reset();
        setUrls([{ url: "", server: "" }]);
      })
      .catch((err) => {
        console.error(err);
        window.alert("Error al crear el código");
      });
  }}
>
      <Stack direction="column" spacing={2} sx={{ mt: 3 }}>
        <TextField name="title" label="Title" required fullWidth />
        <TextField name="code" label="Code" required fullWidth />
        <TextField name="image_url" label="Image URL" required fullWidth />

        {/* 🔽 LISTA DINÁMICA */}
        {urls.map((item, index) => (
          <Stack key={index} direction="row" spacing={1}>
            <TextField
              label="Server"
              value={item.server}
              onChange={(e) =>
                handleChange(index, "server", e.target.value)
              }
              fullWidth
            />
            <TextField
              label="URL"
              value={item.url}
              onChange={(e) =>
                handleChange(index, "url", e.target.value)
              }
              fullWidth
            />

            <Button
              color="error"
              onClick={() => removeUrl(index)}
            >
              X
            </Button>
          </Stack>
        ))}

        <Button variant="outlined" onClick={addUrl}>
          Agregar URL
        </Button>

        <Button type="submit" variant="contained" color="primary">
          Create Code
        </Button>
      </Stack>
    </form>
  );
}