import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "../services/products.api";

export default function ProductDetailPage() {
    const { id } = useParams();

    const { data, isLoading, error } = useQuery({
        queryKey: ["product", id],
        queryFn: () => getProductById(id),
        enabled: !!id,
    });

    if (isLoading) return <div style={{ padding: 24 }}>Loading product...</div>;
    if (error) return <div style={{ padding: 24 }}>Error: {error.message}</div>;

    return (
        <div style={{ padding: 24 }}>
            <Link to="/products">← Back</Link>
            <h1>{data?.name}</h1>
            <p>{data?.description}</p>
            <p>{data?.price ? `Price: ${data.price}` : ""}</p>
        </div>
    );
}
