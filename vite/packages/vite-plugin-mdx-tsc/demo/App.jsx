import { defineComponent } from "vue";
import Demo from "./Demo.mdx";
export default defineComponent({
  name: "App",
  setup() {
    return () => (
      <div>
        <p>App</p>
        <Demo />
      </div>
    );
  },
});
