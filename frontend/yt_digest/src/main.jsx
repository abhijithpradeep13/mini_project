import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {
  Context,
  SearchContext,
  SummaryContext,
  LangContext,
  LoadingContext,
} from "./assets/dbstack/context.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Context>
      <SearchContext>
        <SummaryContext>
          <LangContext>
            <LoadingContext>
              <App />
            </LoadingContext>
          </LangContext>
        </SummaryContext>
      </SearchContext>
    </Context>
  </StrictMode>
);
