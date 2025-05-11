import type { IProduct } from "interfaces/productInterface";

export default function ProductCard({ _id, title, image, price }: IProduct) {
  return (
    <div className="block rounded-lg p-4 shadow-xs bg-indigo-100 shadow-indigo-100">
      <img
        alt={title}
        src={image}
        className="h-56 w-full rounded-md object-cover"
      />

      <div className="mt-2">
        <dl>
          <div>
            <dt className="sr-only">Product Name</dt>

            <dd className="font-medium">{title}</dd>
          </div>
          <div>
            <dt className="sr-only">Price</dt>

            <dd className="text-sm text-gray-500">${price}</dd>
          </div>

          <a
            className="group flex items-center justify-between gap-4 rounded-lg border border-indigo-600 bg-indigo-600 px-5 py-3 transition-colors hover:bg-transparent focus:ring-3 focus:outline-hidden"
            href="#"
          >
            <span className="font-medium text-white transition-colors group-hover:text-indigo-600">
              Add to cart
            </span>

            <span className="shrink-0 rounded-full border border-current bg-white p-2 text-indigo-600">
              <svg
                className="size-5 shadow-sm rtl:rotate-180"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </span>
          </a>
        </dl>
      </div>
    </div>
  );
}
