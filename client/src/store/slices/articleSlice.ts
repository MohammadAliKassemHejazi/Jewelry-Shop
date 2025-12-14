import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import httpClient from "@/utils/httpClient";

export interface IArticleProps {
	id?: string;
	title: string;
	text: string;
}

export interface IArticleModel {
	id: string;
	title: string;
	text: string;
	createdAt: string;
	updatedAt: string;
}

export interface IArticleModelWithUser extends IArticleModel {
	user: {
		id: string;
		name: string;
		email: string;
	};
}

interface ArticleState {
	articleAuthor: IArticleModel[];
	article: IArticleModel | undefined;
	articles: IArticleModelWithUser[];
	error: string;
	loading: boolean;
}

const initialState: ArticleState = {
	articleAuthor: [],
	article: undefined,
	articles: [],
	error: "",
	loading: false,
};

export const fetchArticleById = createAsyncThunk(
	"articles/by-id",
	async (id: string) => {
		const response = await httpClient.get(`/articles/get?id=${id}`);
		return response.data;
	}
);

export const fetchArticleByAuthor = createAsyncThunk(
	"articles/by-author",
	async () => {
		const response = await httpClient.get("/articles/get/author");
		return response.data;
	}
);

export const fetchAllArticles = createAsyncThunk(
	"articles/fetch",
	async () => {
		const response = await httpClient.get("/articles");
		return response.data;
	}
);

export const createArticles = createAsyncThunk(
	"articles/create",
	async (article: IArticleProps) => {
		const response = await httpClient.post("/articles/create", article);
		return response.data;
	}
);

export const updateArticles = createAsyncThunk(
	"articles/update",
	async (article: IArticleProps) => {
		const response = await httpClient.patch(`/articles/update/${article.id}`, article);
		return response.data;
	}
);

export const deleteArticles = createAsyncThunk(
	"articles/delete",
	async (id: string) => {
		const response = await httpClient.delete(`/articles/delete/${id}`);
		return response.data;
	}
);

export const articleSlice = createSlice({
	name: "article",
	initialState: initialState,
	reducers: {
		clearError: (state) => {
			state.error = "";
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchArticleById.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchArticleById.fulfilled, (state, action) => {
				state.loading = false;
				state.article = action.payload;
			})
			.addCase(fetchArticleById.rejected, (state, action) => {
				state.loading = false;
				state.article = undefined;
				state.error = action.error.message || "Failed to fetch article";
			})
			.addCase(fetchArticleByAuthor.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchArticleByAuthor.fulfilled, (state, action) => {
				state.loading = false;
				state.articleAuthor = action.payload.data || [];
			})
			.addCase(fetchArticleByAuthor.rejected, (state, action) => {
				state.loading = false;
				state.articleAuthor = [];
				state.error = action.error.message || "Failed to fetch articles by author";
			})
			.addCase(fetchAllArticles.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchAllArticles.fulfilled, (state, action) => {
				state.loading = false;
				state.articles = action.payload.data || [];
			})
			.addCase(fetchAllArticles.rejected, (state, action) => {
				state.loading = false;
				state.articles = [];
				state.error = action.error.message || "Failed to fetch articles";
			})
			.addCase(createArticles.pending, (state) => {
				state.loading = true;
			})
			.addCase(createArticles.fulfilled, (state, action) => {
				state.loading = false;
				state.article = action.payload;
			})
			.addCase(createArticles.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message || "Failed to create article";
			});
	}
});

export const { clearError } = articleSlice.actions;
export default articleSlice.reducer;
