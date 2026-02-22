using UnityEngine;
using UnityEditor;

/// <summary>
/// Herramienta de editor: construye toda la escena jerárquica
/// con un solo clic desde el menú Tools → Jerarquía 3D.
/// </summary>
public class SceneBuilder : EditorWindow
{
    [MenuItem("Tools/Jerarquía 3D/Construir Escena Completa")]
    public static void BuildScene()
    {
        // ── Limpiar objetos previos con el mismo nombre ───────────────
        string[] toDelete = { "Padre_Cubo", "Directional Light", "Main Camera",
                              "Canvas_TransformUI", "EventSystem" };
        foreach (string name in toDelete)
        {
            GameObject old = GameObject.Find(name);
            if (old != null) DestroyImmediate(old);
        }

        // ─────────────────────────────────────────────────────────────
        // 1. PADRE — Cubo rojo
        // ─────────────────────────────────────────────────────────────
        GameObject padre = GameObject.CreatePrimitive(PrimitiveType.Cube);
        padre.name = "Padre_Cubo";
        padre.transform.position   = Vector3.zero;
        padre.transform.localScale = Vector3.one * 1.2f;
        SetColor(padre, new Color(0.9f, 0.2f, 0.2f));   // Rojo

        var tc = padre.AddComponent<TransformController>();
        var hn_padre = padre.AddComponent<HierarchyNode>();
        hn_padre.nodeName   = "Padre_Cubo";
        hn_padre.gizmoColor = Color.red;
        hn_padre.gizmoSize  = 0.5f;

        // ─────────────────────────────────────────────────────────────
        // 2. HIJO — Esfera azul (child del Padre)
        // ─────────────────────────────────────────────────────────────
        GameObject hijo = GameObject.CreatePrimitive(PrimitiveType.Sphere);
        hijo.name = "Hijo_Esfera";
        hijo.transform.SetParent(padre.transform);
        hijo.transform.localPosition = new Vector3(2.5f, 0f, 0f);
        hijo.transform.localScale    = Vector3.one * 0.8f;
        SetColor(hijo, new Color(0.2f, 0.4f, 0.9f));    // Azul

        var hn_hijo = hijo.AddComponent<HierarchyNode>();
        hn_hijo.nodeName    = "Hijo_Esfera";
        hn_hijo.gizmoColor  = Color.cyan;
        hn_hijo.gizmoSize   = 0.3f;

        // ─────────────────────────────────────────────────────────────
        // 3. NIETO — Cápsula verde (child del Hijo)
        // ─────────────────────────────────────────────────────────────
        GameObject nieto = GameObject.CreatePrimitive(PrimitiveType.Capsule);
        nieto.name = "Nieto_Capsula";
        nieto.transform.SetParent(hijo.transform);
        nieto.transform.localPosition = new Vector3(2f, 0f, 0f);
        nieto.transform.localScale    = Vector3.one * 0.6f;
        SetColor(nieto, new Color(0.2f, 0.85f, 0.3f));  // Verde

        var hn_nieto = nieto.AddComponent<HierarchyNode>();
        hn_nieto.nodeName   = "Nieto_Capsula";
        hn_nieto.gizmoColor = Color.green;
        hn_nieto.gizmoSize  = 0.2f;

        // ─────────────────────────────────────────────────────────────
        // 4. BISNIETO (bonus) — Cilindro amarillo (child del Nieto)
        // ─────────────────────────────────────────────────────────────
        GameObject bisnieto = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
        bisnieto.name = "Bisnieto_Cilindro";
        bisnieto.transform.SetParent(nieto.transform);
        bisnieto.transform.localPosition = new Vector3(1.8f, 0f, 0f);
        bisnieto.transform.localScale    = new Vector3(0.5f, 0.3f, 0.5f);
        SetColor(bisnieto, new Color(1f, 0.85f, 0.1f));  // Amarillo

        var hn_bis = bisnieto.AddComponent<HierarchyNode>();
        hn_bis.nodeName   = "Bisnieto_Cilindro";
        hn_bis.gizmoColor = Color.yellow;
        hn_bis.gizmoSize  = 0.15f;

        // ─────────────────────────────────────────────────────────────
        // 5. ILUMINACIÓN
        // ─────────────────────────────────────────────────────────────
        GameObject light = new GameObject("Directional Light");
        var dl = light.AddComponent<Light>();
        dl.type      = LightType.Directional;
        dl.intensity = 1.2f;
        dl.color     = Color.white;
        light.transform.eulerAngles = new Vector3(50f, -30f, 0f);

        // ─────────────────────────────────────────────────────────────
        // 6. CÁMARA
        // ─────────────────────────────────────────────────────────────
        GameObject cam = new GameObject("Main Camera");
        cam.tag = "MainCamera";
        var camera = cam.AddComponent<Camera>();
        camera.backgroundColor = new Color(0.12f, 0.12f, 0.18f);
        camera.clearFlags      = CameraClearFlags.SolidColor;
        cam.transform.position = new Vector3(0f, 4f, -12f);
        cam.transform.LookAt(padre.transform);

        // ─────────────────────────────────────────────────────────────
        // 7. UI — Canvas con sliders y labels
        // ─────────────────────────────────────────────────────────────
        BuildUI(padre, tc);

        Debug.Log("✅ Escena construida correctamente.\n" +
                  "Jerarquía: Padre_Cubo → Hijo_Esfera → Nieto_Capsula → Bisnieto_Cilindro\n" +
                  "Asigna las referencias del UIManager en el Inspector.");

        EditorUtility.DisplayDialog("Escena Construida",
            "✅ Jerarquía creada:\n\n" +
            "👑 Padre_Cubo (rojo)\n" +
            "   🔷 Hijo_Esfera (azul)\n" +
            "      🔸 Nieto_Capsula (verde)\n" +
            "         ▸ Bisnieto_Cilindro (amarillo)\n\n" +
            "Revisa el Inspector del Canvas para asignar las referencias del UIManager.",
            "OK");
    }

    // ─── Helper: aplicar color a un material ──────────────────────────
    private static void SetColor(GameObject go, Color color)
    {
        var renderer = go.GetComponent<Renderer>();
        if (renderer == null) return;
        var mat = new Material(Shader.Find("Standard"));
        mat.color = color;
        renderer.material = mat;
    }

    // ─── Construir UI básica ──────────────────────────────────────────
    private static void BuildUI(GameObject padre, TransformController tc)
    {
        // Canvas
        GameObject canvasGO = new GameObject("Canvas_TransformUI");
        var canvas = canvasGO.AddComponent<Canvas>();
        canvas.renderMode = RenderMode.ScreenSpaceOverlay;
        canvasGO.AddComponent<UnityEngine.UI.CanvasScaler>();
        canvasGO.AddComponent<UnityEngine.UI.GraphicRaycaster>();

        // EventSystem
        GameObject es = new GameObject("EventSystem");
        es.AddComponent<UnityEngine.EventSystems.EventSystem>();
        es.AddComponent<UnityEngine.EventSystems.StandaloneInputModule>();

        // UIManager en el Canvas
        var uim = canvasGO.AddComponent<UIManager>();
        uim.target          = tc;
        uim.padreTransform  = padre.transform;

        Debug.Log("Canvas y UIManager creados. Conecta los Sliders y Labels en el Inspector.");
    }

    [MenuItem("Tools/Jerarquía 3D/Limpiar Escena")]
    public static void ClearScene()
    {
        string[] names = { "Padre_Cubo", "Canvas_TransformUI",
                           "EventSystem", "Main Camera", "Directional Light" };
        foreach (string n in names)
        {
            var go = GameObject.Find(n);
            if (go != null) DestroyImmediate(go);
        }
        Debug.Log("Escena limpiada.");
    }
}
