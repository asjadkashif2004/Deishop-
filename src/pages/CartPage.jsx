import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import AppLayout from "../app/AppLayout";
import { getCart, updateCartItem, removeCartItem } from "../services/cart.api";
import styles from "./CartPage.module.css";

export default function CartPage() {
    const qc = useQueryClient();

    const { data, isLoading, error } = useQuery({
        queryKey: ["cart"],
        queryFn: getCart,
    });

    const updateMut = useMutation({
        mutationFn: ({ itemId, quantity }) => updateCartItem(itemId, { quantity }),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
    });

    const removeMut = useMutation({
        mutationFn: (itemId) => removeCartItem(itemId),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
    });

    if (isLoading) {
        return (
            <AppLayout>
                <div className={styles.state}>Loading your cart…</div>
            </AppLayout>
        );
    }

    if (error) {
        return (
            <AppLayout>
                <div className={styles.stateError}>
                    Error loading cart: {error.message}
                </div>
            </AppLayout>
        );
    }

    const items = data?.items || data || [];

    return (
        <AppLayout>
            <div className={styles.wrapper}>
                <h1 className={styles.title}>
                    <ShoppingBag size={22} />
                    Your Cart
                </h1>

                {items.length === 0 ? (
                    <div className={styles.empty}>
                        Your cart is empty.
                    </div>
                ) : (
                    <div className={styles.list}>
                        {items.map((it) => {
                            const qty = it.quantity || 1;
                            const name = it.productName || it.product?.name || "Item";
                            const price = it.price ?? it.product?.price ?? "-";

                            return (
                                <div key={it.id} className={styles.card}>
                                    <div className={styles.cardTop}>
                                        <div className={styles.name}>{name}</div>

                                        <button
                                            className={styles.remove}
                                            onClick={() => removeMut.mutate(it.id)}
                                            aria-label="Remove item"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    <div className={styles.cardBottom}>
                                        <div className={styles.qty}>
                                            <button
                                                onClick={() =>
                                                    updateMut.mutate({
                                                        itemId: it.id,
                                                        quantity: Math.max(1, qty - 1),
                                                    })
                                                }
                                                aria-label="Decrease quantity"
                                            >
                                                <Minus size={14} />
                                            </button>

                                            <span>{qty}</span>

                                            <button
                                                onClick={() =>
                                                    updateMut.mutate({
                                                        itemId: it.id,
                                                        quantity: qty + 1,
                                                    })
                                                }
                                                aria-label="Increase quantity"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>

                                        <div className={styles.price}>${price}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
