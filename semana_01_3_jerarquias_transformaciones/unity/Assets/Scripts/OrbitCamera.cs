using UnityEngine;
using UnityEngine.InputSystem;

public class OrbitCamera : MonoBehaviour
{
    [Header("Objetivo")]
    public Transform target;
    public Vector3   offset = new Vector3(0f, 2f, 0f);

    [Header("Órbita")]
    public float distance    = 12f;
    public float sensitivity = 3f;
    public float zoomSpeed   = 2f;
    public float minDist     = 3f;
    public float maxDist     = 30f;

    private float   _yaw   = 0f;
    private float   _pitch = 20f;
    private Vector2 _prevMousePos;

    void LateUpdate()
    {
        var mouse = Mouse.current;
        if (mouse == null) return;

        Vector2 mousePos   = mouse.position.ReadValue();
        Vector2 mouseDelta = mousePos - _prevMousePos;
        _prevMousePos = mousePos;

        // Orbitar con clic derecho
        if (mouse.rightButton.isPressed)
        {
            _yaw   += mouseDelta.x * sensitivity * Time.deltaTime * 10f;
            _pitch -= mouseDelta.y * sensitivity * Time.deltaTime * 10f;
            _pitch  = Mathf.Clamp(_pitch, -80f, 80f);
        }

        // Zoom con scroll
        float scroll = mouse.scroll.ReadValue().y;
        distance -= scroll * zoomSpeed * 0.01f * distance;
        distance  = Mathf.Clamp(distance, minDist, maxDist);

        // Aplicar posición
        Quaternion rot        = Quaternion.Euler(_pitch, _yaw, 0f);
        Vector3    focusPoint = (target != null ? target.position : Vector3.zero) + offset;
        transform.position    = focusPoint + rot * new Vector3(0f, 0f, -distance);
        transform.LookAt(focusPoint);
    }
}