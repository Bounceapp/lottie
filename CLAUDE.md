# CLAUDE.md

`@bounceapp/lottie`: one `LottieView` wrapping `lottie-react-native` (iOS/Android) and `lottie-react` (web) behind a shared prop/ref API.

## Commands (pnpm only)

```sh
pnpm typecheck
pnpm lint        # lint:fix to autofix
pnpm test        # add --selectProjects iOS|Android|Web for one platform
pnpm dev:docs    # Storybook on http://localhost:6006
pnpm example web # Expo example app; also: example ios, example android
```

## Testing changes

Always test changes in `src/` in Storybook. Start it with `pnpm dev:docs` and keep it running: the `storybook` MCP server in `.mcp.json` is served by it at `http://localhost:6006/mcp`.

Storybook only covers web. To test on Expo web, iOS and Android, use the example app in `example/` (it imports the library from `src/`): `pnpm example web`, `pnpm example ios`, `pnpm example android`.

## Notes

- `LottieView.native.tsx` is the native pass-through; `LottieView.react.tsx` is the web implementation (`.web.tsx` and `.tsx` re-export it); shared props live in `types.ts`.
- Tests sit next to the source: `*.native.test.tsx` runs on iOS + Android, `*.web.test.tsx` on web, `*.test.tsx` on all.
- Keep the lottie-react-native attribution headers and `NOTICE` intact.
- `docs/` and `lib/` are build output; don't edit them by hand.
- Commits follow Conventional Commits.
