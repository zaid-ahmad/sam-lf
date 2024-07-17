"use client";

import { useEffect, useRef, useState } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { Input } from "@/components/ui/input";

const libraries = ["places"];

export default function GoogleAddressAutocomplete({ onAddressSelect }) {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        libraries: libraries,
    });

    const [autocomplete, setAutocomplete] = useState(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isLoaded && inputRef.current) {
            const autocompleteInstance = new google.maps.places.Autocomplete(
                inputRef.current,
                {
                    fields: ["formatted_address", "address_components"],
                    types: ["address"],
                }
            );
            setAutocomplete(autocompleteInstance);

            autocompleteInstance.addListener("place_changed", () => {
                const place = autocompleteInstance.getPlace();
                if (place.formatted_address) {
                    let postalCode = "";
                    for (const component of place.address_components) {
                        if (component.types.includes("postal_code")) {
                            postalCode = component.long_name;
                            break;
                        }
                    }
                    onAddressSelect(place.formatted_address, postalCode);
                }
            });
        }
    }, [isLoaded, onAddressSelect]);

    return <Input ref={inputRef} />;
}
