module.exports = (mongoose: { model: (arg0: string, arg1: any) => any; Schema: (arg0: { title: StringConstructor; description: StringConstructor; published: BooleanConstructor; }, arg1: { timestamps: boolean; }) => any; }) => {
    const Tutorial = mongoose.model(
      "tutorial",
      mongoose.Schema(
        {
          title: String,
          description: String,
          published: Boolean
        },
        { timestamps: true }
      )
    );
    return Tutorial;
  };