import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Autosuggest from "react-autosuggest";
import useEcomStore from "../../store/ecom-store";
import { styled } from "@mui/system";

// Styled container for the search component
const SearchContainer = styled("div")({
  position: "relative",
  width: "24rem", // w-96
});

// Styled input container
const InputContainer = styled("div")({
  position: "relative",
  width: "100%",
});

// Styled search icon
const SearchIcon = styled("span")({
  position: "absolute",
  left: "1rem",
  top: "50%",
  transform: "translateY(-50%)",
  pointerEvents: "none",
  color: "#9CA3AF", // text-gray-400
  zIndex: 1,
});

const SearchText = () => {
  const actionSearchFilters = useEcomStore(
    (state) => state.actionSearchFilters
  );
  const getProduct = useEcomStore((state) => state.getProduct);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  const onChange = (event, { newValue }) => {
    setQuery(newValue);
  };
  const onSuggestionsFetchRequested = async ({ value }) => {
    if (value.trim() !== "") {
      await actionSearchFilters({ query: value });
      // ดึง Categories จาก Zustand
      const categories = useEcomStore.getState().categories;
      const matchingCategories = categories
        .filter((category) =>
          category.name.toLowerCase().includes(value.toLowerCase())
        )
        .map((category) => ({
          id: category.id,
          name: category.name,
          type: "category", // ใช้แยกประเภทใน renderSuggestion
        }));

      // ดึง Products
      const products = useEcomStore.getState().products;
      const matchingProducts = products.map((product) => ({
        id: product.id,
        name: product.title,
        category: product.category?.name,
        type: "product",
      }));

      // รวม Categories และ Products โดยมี Categories อยู่ด้านบนเสมอ
      setSuggestions([...matchingCategories, ...matchingProducts]);
    } else {
      await getProduct();
      setSuggestions([]);
    }
  };

  const onSuggestionsClearRequested = async () => {
    await getProduct(); // รีเซ็ตสินค้าทั้งหมดเมื่อเคลียร์คำค้นหา
    setSuggestions([]);
  };

  // const onSuggestionsFetchRequested = async ({ value }) => {
  //   if (value.trim() !== "") {
  //     await actionSearchFilters({ query: value });
  //     const products = useEcomStore.getState().products;
  //     const suggestions = products.map((product) => ({
  //       id: product.id,
  //       name: product.title,
  //       category: product.category?.name,
  //     }));
  //     setSuggestions(suggestions);
  //   } else {
  //     setSuggestions([]);
  //   }
  // };

  // const onSuggestionsClearRequested = () => {
  //   setSuggestions([]);
  // };

  const renderSuggestion = (suggestion) => {
    if (suggestion.isNoResults) {
      return (
        <div className="flex flex-col p-3 text-gray-500">
          <span className="font-medium text-sm">ไม่พบผลลัพธ์ที่เกี่ยวข้อง</span>
        </div>
      );
    }
    if (suggestion.type === "category") {
      return (
        <div className="flex flex-col p-3 hover:bg-gray-50">
          <span className="font-bold uppercase text-gray-900 text-base">
            {suggestion.name}
          </span>
        </div>
      );
    }
    return (
      <div className="flex flex-col p-3 hover:bg-gray-50">
        <span className="font-medium text-gray-900 text-sm">
          {suggestion.name}
        </span>
        <span className="text-xs text-gray-500">{suggestion.category}</span>
      </div>
    );
  };

const onSuggestionSelected = (event, { suggestion }) => {
  if (suggestion.type === "category") {
    navigate(`/category/${encodeURIComponent(suggestion.name)}`);
  } else if (suggestion.type === "product") {
    navigate(`/product/${suggestion.id}/${encodeURIComponent(suggestion.name)}`);
  }
  setQuery("");
};

  const onEnterPress = (event) => {
    if (event.key === "Enter") {
      const formattedQuery = encodeURIComponent(
        query.trim().replace(/\s+/g, "-").toLowerCase()
      );

      if (suggestions.length > 0 && !suggestions[0].isNoResults) {
        navigate(`/product/${formattedQuery}`);
        setQuery("");
      } else if (query.trim() !== "") {
        navigate(`/product/${formattedQuery}`);
      }
      setQuery("");
    }
  };

  const updatedSuggestions =
    suggestions.length === 0 && query.trim() !== ""
      ? [{ isNoResults: true }]
      : suggestions;

  const theme = {
    container: "relative w-full",
    input:
      "w-full h-11 pl-12 pr-4 py-2 text-base border border-gray-300 rounded-full focus:outline-none focus:border-red-500 transition-colors duration-200",
    suggestionsContainer:
      "absolute mt-1 w-full bg-white rounded-lg shadow-lg overflow-hidden z-50",
    suggestionsList: "max-h-96 overflow-y-auto py-2",
    suggestion: "cursor-pointer",
    suggestionHighlighted: "bg-gray-50",
  };

  return (
    <SearchContainer>
      <InputContainer>
        <SearchIcon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </SearchIcon>
        <Autosuggest
          suggestions={updatedSuggestions}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          getSuggestionValue={(suggestion) => suggestion.name || ""}
          renderSuggestion={renderSuggestion}
          onSuggestionSelected={onSuggestionSelected}
          inputProps={{
            placeholder: "ค้นหาสินค้า",
            value: query,
            onChange: onChange,
            onKeyDown: onEnterPress,
            className: theme.input,
          }}
          theme={theme}
          highlightFirstSuggestion={true}
        />
      </InputContainer>
    </SearchContainer>
  );
};

export default SearchText;
